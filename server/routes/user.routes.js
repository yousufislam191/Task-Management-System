const { getUser, createNewUser } = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { signUpValidator } = require("../middleware/userAuth");

const userRouter = require("express").Router();

userRouter.get("/", getUser);
userRouter.post("/register", signUpValidator, validationHandler, createNewUser);

module.exports = userRouter;
