const {
  getUser,
  createNewUser,
  activateUserAccount,
  updateUserById,
  getUserById,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.get("/", getUser);
userRouter.get("/:id", getUserById);
userRouter.post("/register", signUpValidator, validationHandler, createNewUser);
userRouter.post("/verify-account", activateUserAccount);
userRouter.put("/:id", updateUserById);

module.exports = userRouter;
