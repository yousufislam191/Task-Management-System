const createError = require("http-errors");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const { successResponse } = require("./response.controller");
const User = require("../models/user.model");
const { findTaskWithId } = require("../helper/findTaskWithId");
const { sequelize } = require("../config/db");

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

// GET task by ID
const getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await findTaskWithId(id);

    return successResponse(res, {
      statusCode: 200,
      message: "Task was retured successfully",
      payload: { task },
    });
  } catch (error) {
    next(error);
  }
};

// GET All Task For Single User by User ID
const getAllTaskForSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Task.findAll({
      where: { createdToTask: id },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });
    if (!task)
      throw createError(
        404,
        "Something went wrong for counting task status for this user"
      );

    return successResponse(res, {
      statusCode: 200,
      message:
        "For this particular id task has been counted and it was retured successfully",
      payload: { task },
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

// for delete Task
const deleteTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;

    await findTaskWithId(id);
    await Task.destroy({ where: { id: id } });

    return successResponse(res, {
      statusCode: 200,
      message: "Task was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Edit Task by Admin
const editTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      throw createError(404, "Task id not found");
    }

    let updates = {};

    // === this field take value from request.body using loop, after that updated value will keep in the updates objects ===
    const allowedFields = ["title", "tag", "description", "deadline"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "status") {
        throw createError(
          404,
          "You will not be able to modify status. When you will create a task then it goes to Assign status default."
        );
      }
    }

    const [rowsUpdated] = await Task.update(updates, {
      where: { id: taskId },
      returning: true, // Return the updated user(s)
      plain: true,
    });
    if (rowsUpdated === 0) {
      throw createError(
        404,
        "Something went wrong. Couldn't update tasks. Please try again"
      );
    }

    const updatedTasks = await findTaskWithId(taskId);

    return successResponse(res, {
      statusCode: 200,
      message: "Task was updated successfully",
      payload: updatedTasks,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Task status
const editTaskStatusById = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const allowedFields = ["status"];
    const updates = {};

    for (const key in req.body) {
      if (
        key === "title" ||
        key === "description" ||
        key === "deadline" ||
        key === "tag"
      ) {
        throw createError(404, "You will not be able to update this");
      }
      if (allowedFields === null)
        throw createError(404, "Status field is required");
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const [rowsUpdated] = await Task.update(updates, {
      where: { id: taskId },
      returning: true, // Return the updated user(s)
      plain: true,
    });

    if (rowsUpdated === 0) {
      throw createError(404, "Task with this ID does not exist");
    }

    const updatedTask = await findTaskWithId(taskId);

    return successResponse(res, {
      statusCode: 200,
      message: "Status updated successfully",
      payload: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewTask,
  getTask,
  deleteTaskById,
  getTaskById,
  editTaskById,
  editTaskStatusById,
  getAllTaskForSingleUser,
};
