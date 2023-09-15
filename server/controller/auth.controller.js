const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { createJWT } = require("../helper/createJWT");
const { jwtAccessKey, expireJwtForLoginAccess } = require("../secret");
const { findWithEmail } = require("../helper/findWithEmail");

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
      expireJwtForLoginAccess
    );
    res.cookie("accessToken", accessToken),
      {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

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

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { handleLogin, handleLogout };
