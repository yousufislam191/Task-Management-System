const { data, taskData } = require("../data");
const Task = require("../models/task.model");
const User = require("../models/user.model");

const seedUser = async (req, res, next) => {
  try {
    // deleting all existing users
    await User.destroy({ where: {} });

    // inserting new users
    const newuser = await User.bulkCreate(data.users);

    // successfull response
    return res.status(201).json(newuser);
  } catch (error) {
    next(error);
  }
};

const seedTask = async (req, res, next) => {
  try {
    // deleting all existing tasks
    await Task.destroy({ where: {} });

    // inserting new taskss
    const newTask = await Task.bulkCreate(taskData.tasks);

    // successfull response
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};
module.exports = { seedUser, seedTask };
