const rateLimit = require("express-rate-limit");
const { errorResponse } = require("../controller/response.controller");

// Specific rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window`
  message:
    "Too many login attempts from this IP, please try again after a minute.",
  handler: (req, res, next, options) => {
    return errorResponse(res, {
      statusCode: 429,
      message: options.message,
    });
  },
});

// General rate limit: 100 requests per minute from each IP
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res, next, options) => {
    return errorResponse(res, {
      statusCode: 429,
      message: options.message,
    });
  },
});

module.exports = { loginLimiter, generalLimiter };
