const {
  getUser,
  createNewUser,
  activateUserAccount,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.get("/", getUser);
userRouter.post("/register", signUpValidator, validationHandler, createNewUser);
userRouter.post("/verify-account", activateUserAccount);

module.exports = userRouter;
