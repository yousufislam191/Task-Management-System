const {
  getUser,
  createNewUser,
  activateUserAccount,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { signUpValidator } = require("../middleware/userAuth");
const { uuidRegex } = require("../secret");

const userRouter = require("express").Router();

userRouter.get("/", isLoggedIn, isAdmin, getUser);
userRouter.post(
  "/register",
  isLoggedOut,
  signUpValidator,
  validationHandler,
  createNewUser
);
userRouter.post("/verify-account", isLoggedOut, activateUserAccount);
userRouter.get(`/:id(${uuidRegex})`, isLoggedIn, getUserById);
userRouter.put(`/:id(${uuidRegex})`, isLoggedIn, updateUserById);
userRouter.delete(`/:id(${uuidRegex})`, isLoggedIn, deleteUserById);

module.exports = userRouter;
