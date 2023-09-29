const createError = require("http-errors");
const { Op } = require("sequelize");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { successResponse } = require("./response.controller");
const {
  jwtActivationKey,
  expireJwtForActivateAccount,
  appName,
  clientURL,
  jwtPasswordResetKey,
  expireJwtForResetPassword,
} = require("../secret");
const { createJWT } = require("../helper/createJWT");
const { findWithId } = require("../helper/findWithId");
const { findWithEmail } = require("../helper/findWithEmail");
const sendEmail = require("../helper/sendEmail");
const Task = require("../models/task.model");

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

    // Find all tasks associated with the user
    const userTasks = await Task.findAll({
      where: { createdToTask: user.id },
    });

    if (userTasks) {
      await Task.destroy({
        where: { createdToTask: user.id },
      });
    }

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
      message: "User and associated tasks were deleted successfully",
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
    const token = btoa(
      createJWT(
        { name, email, password },
        jwtActivationKey,
        expireJwtForActivateAccount
      )
    );

    //prepare email
    const emailData = {
      email,
      subject: `Activate your ${appName} Account`, // Subject line
      text: "Verify your account", // plain text body
      html: `
    <h2>Hello ${name}</h2>
    <h3>Thanks for registering ${appName} account</h3>
    <h4>Please click here to <a href="${clientURL}/verify-email/${token}" target="_blank">activate your account</a>. The Link will be expire after ${expireJwtForActivateAccount}.</h4>
    `, // html body
    };

    // send activation email
    // sendEmail(emailData);

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
      const decodedToken = JWT.verify(atob(token), jwtActivationKey);
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
        message: "Your account has been activated successfully. Please login",
        payload: { decodedToken },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
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
    const allowedFields = ["name", "password"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(404, "Email cannot be updated");
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

// Update user password
const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw createError(404, "New Password and Confirm Password do not match");
    }

    const user = await findWithId(User, userId);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "Old Password is incorrect");
    }

    const [rowsUpdated] = await User.update(
      { password: newPassword },
      {
        where: { id: userId },
        returning: true, // Return the updated user(s)
        plain: true,
      }
    );
    if (rowsUpdated === 0) {
      throw createError(404, "User with this ID does not exist");
    }

    const attributes = { exclude: ["password"] };
    const updatedUsers = await findWithId(User, userId, attributes);

    return successResponse(res, {
      statusCode: 200,
      message: "Password was updated successfully",
      payload: { updatedUsers },
    });
  } catch (error) {
    next(error);
  }
};

// Forget user password
const forgetUserPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await findWithEmail(User, email, next);

    // create token
    const token = btoa(
      createJWT({ email }, jwtPasswordResetKey, expireJwtForResetPassword)
    );

    //prepare email
    const emailData = {
      email,
      subject: `Reset your password`, // Subject line
      text: "Reset your password", // plain text body
      html: `
    <h2>Hello ${userData.name}</h2>
    <h3>Thanks for requesting to reset your password.</h3>
    <h4>Please click here to <a href="${clientURL}/reset-password/${token}" target="_blank">reset your password</a>. The Link will be expire after ${expireJwtForResetPassword}.</h4>
    `, // html body
    };

    // send activation email
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `A reset password link has been sent to this email ${email}. Please go to your email to reset your password.`,
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// Forget user password
const resetUserPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = JWT.verify(atob(token), jwtPasswordResetKey);
    if (!decoded) throw createError(400, "Unable to verify user account");

    const [rowsUpdated] = await User.update(
      { password: password },
      {
        where: { email: decoded.email },
        returning: true, // Return the updated user(s)
        plain: true,
      }
    );
    if (rowsUpdated === 0) {
      throw createError(400, "Password reset failed. Please try again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// GET All user with their task status count
const getAllUsersWithTaskStatusCounts = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.findAll({
      where: {
        id: {
          [Op.not]: currentUserId,
        },
      },
      exclude: ["password"],
    });

    if (!users || users.length === 0) {
      throw createError(404, "User not found");
    }

    // Initialize an empty array to store the final response
    const response = [];

    // Loop through each user to retrieve their associated tasks and status counts
    for (const user of users) {
      // Perform a JOIN operation between User and Task tables on 'createdByTask' and 'createdToTask'
      const tasks = await Task.findAll({
        where: { createdToTask: user.id },
        attributes: ["status"],
      });

      // Aggregate status counts
      const statusCounts = tasks.reduce((acc, task) => {
        const status = task.status;
        if (!acc[status]) {
          acc[status] = 1;
        } else {
          acc[status]++;
        }
        return acc;
      }, {});

      // Prepare user data with status counts
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: Object.keys(statusCounts).map((status) => ({
          status: parseInt(status, 10),
          count: statusCounts[status],
        })),
      };

      // Add the user data to the response array
      response.push(userData);
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Users with task status counts were retrieved successfully",
      payload: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  deleteUserById,
  createNewUser,
  activateUserAccount,
  updateUserById,
  updateUserPassword,
  forgetUserPassword,
  resetUserPassword,
  getAllUsersWithTaskStatusCounts,
};
