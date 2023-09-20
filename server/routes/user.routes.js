const {
  createNewUser,
  activateUserAccount,
  updateUserById,
  getUserById,
  deleteUserById,
  updateUserPassword,
  forgetUserPassword,
  resetUserPassword,
  getAllUsersWithTaskStatusCounts,
} = require("../controller/user.controllers");
const { validationHandler } = require("../middleware");
const { isLoggedIn, isLoggedOut, checkIsAdmin } = require("../middleware/auth");
const {
  signUpValidator,
  passwordUpdateInValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} = require("../middleware/userAuth");
const { uuidRegex } = require("../secret");

const userRouter = require("express").Router();

userRouter.get("/", isLoggedIn, checkIsAdmin, getAllUsersWithTaskStatusCounts);
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
userRouter.put(
  `/update-password/:id(${uuidRegex})`,
  isLoggedIn,
  passwordUpdateInValidator,
  validationHandler,
  updateUserPassword
);
userRouter.post(
  "/forgot-password",
  forgetPasswordValidator,
  validationHandler,
  forgetUserPassword
);
userRouter.put(
  "/reset-password",
  resetPasswordValidator,
  validationHandler,
  resetUserPassword
);

module.exports = userRouter;
