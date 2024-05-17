const createError = require("http-errors");
const { sequelize } = require("../config/db");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const FailedTask = require("../models/failedTask.model");

const findTaskWithId = async (id) => {
  try {
    const addAttributes = [
      { model: User, as: "createdBy", attributes: ["name"] },
      { model: User, as: "createdTo", attributes: ["name"] },
    ];
    let task = await Task.findOne({
      where: { id: id },
      include: addAttributes,
    });
    if (!task) {
      task = await FailedTask.findOne({
        where: { id: id },
        include: addAttributes,
      });
    }
    if (!task) throw createError(404, "Task does not exist with this id");
    return task;
  } catch (error) {
    if (error instanceof sequelize.BaseError) {
      throw createError(400, `Invalid task id`);
    }
    throw error;
  }
};
module.exports = { findTaskWithId };
