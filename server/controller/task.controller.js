const createError = require("http-errors");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const { successResponse } = require("./response.controller");

// GET all task by admin
const getTask = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({});

    if (!tasks || tasks.lenght === 0)
      throw createError(404, "Any tasks not available");

    return successResponse(res, {
      statusCode: 200,
      message: "Tasks were retured successfully",
      payload: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewTask, getTask };
