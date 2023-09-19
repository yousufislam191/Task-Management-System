const {
  createNewTask,
  getTask,
  deleteTaskById,
} = require("../controller/task.controller");
const { validationHandler } = require("../middleware");
const { isLoggedIn, checkIsAdmin } = require("../middleware/auth");
const { createTaskValidator } = require("../middleware/taskAuth");
const { uuidRegex } = require("../secret");

const taskRouter = require("express").Router();

taskRouter.get("/", isLoggedIn, checkIsAdmin, getTask);
taskRouter.post(
  "/create-task",
  isLoggedIn,
  createTaskValidator,
  validationHandler,
  checkIsAdmin,
  createNewTask
);
taskRouter.delete(
  `/:id(${uuidRegex})`,
  isLoggedIn,
  checkIsAdmin,
  deleteTaskById
);

module.exports = taskRouter;
