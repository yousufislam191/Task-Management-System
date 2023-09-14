require("dotenv").config();

const serverPort = process.env.PORT || 5200;
const dbHost = process.env.DB_HOST || "localhost";
const dbUserName = process.env.DB_USER_NAME || "root";
const dbPass = process.env.DB_PASS || "";
const dbName = process.env.DB_NAME || "team_management_system";

const jwtActivationKey =
  process.env.USER_ACCOUNT_ACTIVATE_KEY || "jhgUYFD76^$%t654U&b_@#";
const expireJwtForActivateAccount =
  process.env.USER_ACCOUNT_JWT_EXPIRE_TIME || "5m";

const clientURL = process.env.CLIENT_URL || "";
const appName = process.env.APP_NAME || "Task Management System";

const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

module.exports = {
  serverPort,
  dbHost,
  dbUserName,
  dbPass,
  dbName,
  jwtActivationKey,
  expireJwtForActivateAccount,
  clientURL,
  appName,
  smtpUserName,
  smtpPassword,
};
