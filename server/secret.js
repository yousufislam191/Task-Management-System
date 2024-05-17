require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 5100;
const dbPort = process.env.DB_PORT || 3306;
const dbHost = process.env.DB_HOST || "localhost";
const dbUserName = process.env.DB_USER_NAME || "root";
const dbPass = process.env.DB_PASS || "";
const dbName = process.env.DB_NAME || "task_management_system_test";

const jwtActivationKey =
  process.env.USER_ACCOUNT_ACTIVATE_KEY || "jhgUYFD76^$%t654U&b_@#";
const expireJwtForActivateAccount =
  process.env.USER_ACCOUNT_JWT_EXPIRE_TIME || "5m";

const jwtAccessKey = process.env.USER_LOGIN_KEY || "IUBT^*@#&%I@U&TEviq368rew";
const accessTokenExpireTime = process.env.USER_ACCESS_TOKEN_EXPIRE_TIME || "5m";
const jwtRefreshTokenKey =
  process.env.REFRESH_TOKEN_KEY || "&^uytr76^YR&^$UYGEu3&^123";
const refreshTokenExpireTime =
  process.env.USER_REFRESH_TOKEN_EXPIRE_TIME || "7d";

const jwtPasswordResetKey =
  process.env.USER_PASSWORD_RESET_KEY || "iu%&^TUf7r7yut12i3g&";
const expireJwtForResetPassword =
  process.env.USER_PASSWORD_RESET_JWT_EXPIRE_TIME || "10m";

const clientURL = process.env.CLIENT_URL || "http://localhost";
const appName = process.env.APP_NAME || "Task Management System";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost";

const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const uuidRegex =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}";

module.exports = {
  serverPort,
  dbPort,
  dbHost,
  dbUserName,
  dbPass,
  dbName,
  jwtActivationKey,
  expireJwtForActivateAccount,
  clientURL,
  appName,
  corsOrigin,
  smtpUserName,
  smtpPassword,
  jwtAccessKey,
  accessTokenExpireTime,
  uuidRegex,
  jwtPasswordResetKey,
  expireJwtForResetPassword,
  refreshTokenExpireTime,
  jwtRefreshTokenKey,
};
