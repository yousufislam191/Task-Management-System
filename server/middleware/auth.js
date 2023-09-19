const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createError(401, "Access token not found. Please login again");
    }
    const decode = JWT.verify(accessToken, jwtAccessKey);
    if (!decode) {
      throw createError(401, "Invalid access token. Please login again");
    }

    req.user = decode.user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      throw createError(400, "User is already logged in");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const checkIsAdmin = async (req, res, next) => {
  try {
    if (req.user.isAdmin === false) {
      throw createError(403, "Forbidden... Cannot access to this page.");
    }
    next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { isLoggedIn, isLoggedOut, checkIsAdmin };
