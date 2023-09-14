const { handleLogin, handleLogout } = require("../controller/auth.controller");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");

const authRouter = require("express").Router();

authRouter.post("/login", isLoggedOut, handleLogin);
authRouter.post("/logout", isLoggedIn, handleLogout);
module.exports = authRouter;
