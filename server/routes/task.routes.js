const {
  createNewTask,
  deleteTaskById,
  getTaskById,
  editTaskById,
  editTaskStatusById,
  getAllTaskForSingleUser,
  getAllTasks,
} = require("../controller/task.controller");
const { validationHandler } = require("../middleware");
const { isLoggedIn, checkIsAdmin } = require("../middleware/auth");
const { createTaskValidator } = require("../middleware/taskAuth");
const { uuidRegex } = require("../secret");

const taskRouter = require("express").Router();

taskRouter.post("/", isLoggedIn, checkIsAdmin, getAllTasks);
taskRouter.post("/user-tasks", isLoggedIn, getAllTaskForSingleUser);
taskRouter.get(`/single-task/:id(${uuidRegex})`, isLoggedIn, getTaskById);
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
