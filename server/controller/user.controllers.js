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
const { findWithId } = require("../helper/findWithId");

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

// GET user by ID
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const attributes = { exclude: ["password"] };
    const user = await findWithId(User, id, attributes);
    return successResponse(res, {
      statusCode: 200,
      message: "User was retured successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE user
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const attributes = { exclude: ["password"] };
    const user = await findWithId(User, id, attributes);

    const deleteUser = await User.destroy({
      where: {
        [Op.and]: [{ id: user.id }, { isAdmin: { [Op.eq]: false } }],
      },
    });
    if (!deleteUser)
      throw createError(
        404,
        "This user will never be deleted. Before being deleted, you have to make another user an admin."
      );

    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
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

// Update user
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let updates = {};

    // === this field take value from request.body using loop, after that updated value will keep in the updates objects ===
    for (let key in req.body) {
      if (["name", "password"].includes(key)) {
        updates[key] = req.body[key];
      } else {
        throw createError(404, "This info cannot be updated");
      }
    }

    const [rowsUpdated] = await User.update(updates, {
      where: { id: userId },
      returning: true, // Return the updated user(s)
      plain: true,
    });
    if (rowsUpdated === 0) {
      throw createError(404, "User with this ID does not exist");
    }

    const attributes = { exclude: ["password"] };
    const updatedUsers = await findWithId(User, userId, attributes);

    return successResponse(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: updatedUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  getUserById,
  deleteUserById,
  createNewUser,
  activateUserAccount,
  updateUserById,
};
