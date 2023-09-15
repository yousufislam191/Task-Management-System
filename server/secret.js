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

const jwtAccessKey = process.env.USER_LOGIN_KEY || "IUBT^*@#&%I@U&TEviq368rew";
const expireJwtForLoginAccess = process.env.USER_LOGIN_JWT_EXPIRE_TIME || "15m";

const jwtPasswordResetKey =
  process.env.USER_PASSWORD_RESET_KEY || "iu%&^TUf7r7yut12i3g&";
const expireJwtForResetPassword =
  process.env.USER_PASSWORD_RESET_JWT_EXPIRE_TIME || "10m";

const clientURL = process.env.CLIENT_URL || "";
const appName = process.env.APP_NAME || "Task Management System";

const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const uuidRegex =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}";

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
  jwtAccessKey,
  expireJwtForLoginAccess,
  uuidRegex,
  jwtPasswordResetKey,
  expireJwtForResetPassword,
};
