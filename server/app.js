const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const { errorResponse } = require("./controller/response.controller");
const seedRouter = require("./routes/seed.routes");
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const { corsOrigin } = require("./secret");
const taskRouter = require("./routes/task.routes");
const {
  scheduleTaskReminders,
  movedFailedTaskRemindersSchedule,
} = require("./helper/reminderScheduler");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();
require("./config/db");

// Apply the general rate limit to all requests
app.use(generalLimiter);

app.use(cors({ credentials: true, origin: corsOrigin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1); // Trust first proxy if you're behind a proxy (like Vercel)
app.use(morgan("dev"));
app.use(xssClean());

// cron job for failed task reminders
scheduleTaskReminders();
movedFailedTaskRemindersSchedule();

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
