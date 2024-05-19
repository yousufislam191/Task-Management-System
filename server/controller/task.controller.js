const createError = require("http-errors");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const { successResponse } = require("./response.controller");
const User = require("../models/user.model");
const { findTaskWithId } = require("../helper/findTaskWithId");
const FailedTask = require("../models/failedTask.model");

// GET all tasks by admin with status or not status
const getAllTasks = async (req, res, next) => {
  try {
    const { status, name } = req.body;
    let whereClause = {};
    let message;

    if (status && status !== "") {
      let setStatus;
      if (status === "PENDING") {
        setStatus = 0;
      } else if (status === "INPROGRESS") {
        setStatus = 1;
      } else if (status === "COMPLETED") {
        setStatus = 2;
      } else if (status === "FAILED") {
        setStatus = 3;
      } else {
        throw createError(404, "Invalid status");
      }

      whereClause = { status: setStatus };
    }

    const addAttributes = [
      { model: User, as: "createdBy", attributes: ["name"] },
      { model: User, as: "createdTo", attributes: ["name"] },
    ];

    if (name && name !== "") {
      addAttributes.push({
        model: User,
        as: "createdTo",
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: ["name"],
      });
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: addAttributes,
      order: [["createdAt", "DESC"]],
    });

    const failedTasks = await FailedTask.findAll({
      where: whereClause,
      include: addAttributes,
      order: [["createdAt", "DESC"]],
    });

    const allTasks = [...tasks, ...failedTasks].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    if (allTasks) message = "Tasks were returned successfully";

    if (!allTasks || allTasks.length === 0) message = "Task not available...";

    return successResponse(res, {
      statusCode: 200,
      message: message,
      payload: { totalTask: allTasks.length, allTasks },
    });
  } catch (error) {
    next(error);
  }
};

// GET All Task For Single User by User ID with status or not status
const getAllTaskForSingleUser = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    let message;

    const filter = {
      where: { createdToTask: id },
      include: { model: User, as: "createdBy", attributes: ["name"] },
      order: [["createdAt", "DESC"]],
    };

    // Apply status filter if provided
    if (status && status !== "") {
      let setStatus;
      if (status === "PENDING") {
        setStatus = 0;
      } else if (status === "INPROGRESS") {
        setStatus = 1;
      } else if (status === "COMPLETED") {
        setStatus = 2;
      } else if (status === "FAILED") {
        setStatus = 3;
      } else {
        throw createError(404, "Invalid status");
      }
      filter.where.status = setStatus;
    }

    const tasks = await Task.findAll(filter);
    const failedTasks = await FailedTask.findAll(filter);

    const allTasks = [...tasks, ...failedTasks].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    if (allTasks)
      message =
        "For this particular id task has been counted and it was retured successfully";

    if (!allTasks || allTasks.length === 0) message = "Task not available...";

    return successResponse(res, {
      statusCode: 200,
      message: message,
      payload: { totalTask: allTasks.length, allTasks },
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

// for create new Task
const createNewTask = async (req, res, next) => {
  try {
    const createdByTask = req.user.id;
    const { title, tag, description, deadline, hour, minute, createdToTask } =
      req.body;

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

    const user = await User.findByPk(createdToTask, {
      attributes: ["email"],
    });

    const newTask = {
      email: user.email,
      title,
      tag,
      description,
      deadline,
      hour,
      minute,
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

    const task = await findTaskWithId(id);

    if (task) {
      const deleteTaskFromTaskTable = await Task.destroy({ where: { id: id } });
      if (!deleteTaskFromTaskTable) {
        await FailedTask.destroy({ where: { id: id } });
        return successResponse(res, {
          statusCode: 200,
          message: "Task was deleted successfully",
        });
      }
      return successResponse(res, {
        statusCode: 200,
        message: "Task was deleted successfully",
      });
    }
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
    const now = new Date();

    // === this field take value from request.body using loop, after that updated value will keep in the updates objects ===
    const allowedFields = [
      "title",
      "tag",
      "description",
      "deadline",
      "hour",
      "minute",
    ];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        if (key === "deadline") {
          const deadline = new Date(req.body[key]);
          if (deadline < now) {
            throw createError(400, "Deadline cannot be in the past");
          } else if (deadline.toDateString() === now.toDateString()) {
            const hour = parseInt(req.body.hour);
            const minute = parseInt(req.body.minute);

            if (hour < now.getHours()) {
              throw createError(400, "Hour cannot be in the past");
            } else if (hour === now.getHours() && minute <= now.getMinutes()) {
              throw createError(400, "Must be upcoming time to set deadline");
            }
          }
        } else if ((key === "hour" || key === "minute") && req.body.deadline) {
          const hour = parseInt(req.body.hour);
          const minute = parseInt(req.body.minute);
          if (
            isNaN(hour) ||
            hour < 0 ||
            hour > 23 ||
            isNaN(minute) ||
            minute < 0 ||
            minute > 59
          ) {
            throw createError(400, "Invalid time");
          }
        }
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
  getAllTasks,
  deleteTaskById,
  getTaskById,
  editTaskById,
  editTaskStatusById,
  getAllTaskForSingleUser,
};
