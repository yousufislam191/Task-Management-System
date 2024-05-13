const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const { errorResponse } = require("./controller/response.controller");
const seedRouter = require("./routes/seed.routes");
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const { corsOrigin } = require("./secret");
const taskRouter = require("./routes/task.routes");
// const {
//   movedFailedTaskRemindersSchedule,
// } = require("./helper/reminderScheduler");
const app = express();

require("./config/db");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP. Please try again later",
});

app.use(cors({ credentials: true, origin: corsOrigin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(xssClean());
// app.use(limiter);

// cron job for failed task reminders
// movedFailedTaskRemindersSchedule();

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);
// app.use("/api/seed", seedRouter); // Seed api has been used for development purposes

// app.get("/", (req, res) => {
//   res.status(200).send("server home route");
// });

// client error handling
app.use((req, res, next) => {
  next(createError(404, "Page Not Found"));
});

// server error handling --> all errors handeled finally
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
