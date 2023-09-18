const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { createJWT } = require("../helper/createJWT");
const {
  jwtAccessKey,
  jwtRefreshTokenKey,
  accessTokenExpireTime,
  refreshTokenExpireTime,
} = require("../secret");
const { findWithEmail } = require("../helper/findWithEmail");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../helper/cookie");

// FOR LOGIN
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findWithEmail(User, email, next);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email and password do not match");
    }

    // create access token
    const accessToken = createJWT(
      { user },
      jwtAccessKey,
      accessTokenExpireTime
    );
    setAccessTokenCookie(res, accessToken);

    // create refresh token
    const refreshToken = createJWT(
      { user },
      jwtRefreshTokenKey,
      refreshTokenExpireTime
    );
    setRefreshTokenCookie(res, refreshToken);

    // Exclude 'password' from the user object before sending it in the response
    const userWithoutPassword = { ...user.get() };
    delete userWithoutPassword.password;

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// FOR LOGOUT
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// FOR REFRESH TOKEN
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const decodedToken = JWT.verify(oldRefreshToken, jwtRefreshTokenKey);
    if (!decodedToken) {
      throw createError(401, "Invalid refresh token. Please login again");
    }

    // create access token
    const accessToken = createJWT(
      decodedToken.user,
      jwtAccessKey,
      accessTokenExpireTime
    );
    setAccessTokenCookie(res, accessToken);

    // Exclude 'password' from the user object before sending it in the response
    const user = { ...decodedToken.user };
    delete user.password;

    return successResponse(res, {
      statusCode: 200,
      message: "New access token generated successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

// FOR PROTECTED ROUTE
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = JWT.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createError(401, "Invalid access token. Please login again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected resourceses accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
