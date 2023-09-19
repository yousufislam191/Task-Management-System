const createError = require("http-errors");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const { successResponse } = require("./response.controller");
const User = require("../models/user.model");

// GET all task by admin
const getTask = async (req, res, next) => {
  try {
    const addAttributes = [
      { model: User, as: "createdBy", attributes: ["name"] },
      { model: User, as: "createdTo", attributes: ["name"] },
    ];

    const tasks = await Task.findAll({
      include: addAttributes,
    });

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

// for create new Task
const createNewTask = async (req, res, next) => {
  try {
    const createdByTask = req.user.id;
    const { title, tag, description, deadline, createdToTask } = req.body;

    if (createdByTask === createdToTask)
      throw createError(
        404,
        "You are not allowed to create task for yourself."
      );

    const filter = {
      [Op.and]: [{ createdToTask: createdToTask }, { title: title }],
    };

    const checkingExistingTask = await Task.findOne({ where: filter });
    if (checkingExistingTask)
      throw createError(409, "Same task already assigned for this user");

    const newTask = {
      title,
      tag,
      description,
      deadline,
      createdByTask,
      createdToTask,
    };
    const task = await Task.create(newTask);

    return successResponse(res, {
      statusCode: 201,
      message: "Task created successfully",
      payload: { task },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewTask, getTask };
