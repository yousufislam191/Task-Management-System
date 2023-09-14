const createError = require("http-errors");
const { Op } = require("sequelize");
const User = require("../models/user.model");
const { successResponse } = require("./response.controller");

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

// DELETE user

// for create new user and send email activation notification

// for activate user account

module.exports = {
  getUser,
};
