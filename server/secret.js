require("dotenv").config();

const serverPort = process.env.PORT || 5200;
const dbHost = process.env.DB_HOST || "localhost";
const dbUserName = process.env.DB_USER_NAME || "root";
const dbPass = process.env.DB_PASS || "";
const dbName = process.env.DB_NAME || "team_management_system";

module.exports = { serverPort, dbHost, dbUserName, dbPass, dbName };
