const createError = require("http-errors");
const { Op } = require("sequelize");
const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const {
  jwtActivationKey,
  expireJwtForActivateAccount,
  appName,
  clientURL,
} = require("../secret");
const sendEmailWithNodamailer = require("../helper/email");
const { createJWT } = require("../helper/createJWT");

// GET all user by admin
const getUser = async (req, res, next) => {
  try {
    const filter = {
      isAdmin: {
        [Op.eq]: false,
      },
    };

    // Define the attributes to exclude
    const attributes = { exclude: ["password"] };

    const users = await User.findAll({
      where: filter,
      attributes,
    });

    if (!users) throw createError(404, "User not found");

    return successResponse(res, {
      statusCode: 200,
      message: "Users were retured successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

// for create new user and send email activation notification
const createNewUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // create token
    const token = createJWT(
      { name, email, password },
      jwtActivationKey,
      expireJwtForActivateAccount
    );

    //prepare email
    const emailData = {
      email,
      subject: `Activate your ${appName} Account`, // Subject line
      text: "Verify your account", // plain text body
      html: `
    <h2>Hello ${name}</h2>
    <h3>Thanks for registering ${appName} account</h3>
    <h4>Please click here to <a href="${clientURL}/api/activate/${token}" target="_blank">activate your account</a>. The Link will be expire after ${expireJwtForActivateAccount}.</h4>
    `, // html body
    };

    // send activation email
    try {
      await sendEmailWithNodamailer(emailData);
    } catch (error) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `A verification email has been sent to this email ${email}. Please go to your email to complete your registration process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// for activate user account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found");

    try {
      const decodedToken = JWT.verify(token, jwtActivationKey);
      if (!decodedToken)
        throw createError(401, "Unable to verify user account");

      const userExists = await User.findOne({
        where: { email: decodedToken.email },
      });
      if (userExists) {
        throw createError(409, "User already exists. Please sign in");
      }

      await User.create(decodedToken);

      return successResponse(res, {
        statusCode: 201,
        message: "Your account has been activated successfully",
        payload: { decodedToken },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid JSON Web Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  createNewUser,
  activateUserAccount,
};
