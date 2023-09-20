const {
  createNewTask,
  getTask,
  deleteTaskById,
  getTaskById,
  editTaskById,
  editTaskStatusById,
} = require("../controller/task.controller");
const { validationHandler } = require("../middleware");
const { isLoggedIn, checkIsAdmin } = require("../middleware/auth");
const { createTaskValidator } = require("../middleware/taskAuth");
const { uuidRegex } = require("../secret");

const taskRouter = require("express").Router();

taskRouter.get("/", isLoggedIn, checkIsAdmin, getTask);
taskRouter.get(`/:id(${uuidRegex})`, isLoggedIn, getTaskById);
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
taskRouter.put(`/:id(${uuidRegex})`, isLoggedIn, checkIsAdmin, editTaskById);
taskRouter.put(`/status/:id(${uuidRegex})`, isLoggedIn, editTaskStatusById);

module.exports = taskRouter;
