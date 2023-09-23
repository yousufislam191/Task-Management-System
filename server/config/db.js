const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
const { dbHost, dbUserName, dbPass, dbName, dbPort } = require("../secret");

// ============ for MySQL with Sequelize Connetion ============
const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: mysql2,
  host: dbHost,
  port: dbPort,
  username: dbUserName,
  password: dbPass,
  database: dbName,
  dialectOptions: {
    ssl: dbHost !== "localhost" ? { rejectUnauthorized: false } : false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Synchronize the User model with the database
    try {
      await sequelize.sync({ force: false }); // Set force to true to drop and recreate the table
      console.log("Model synchronized with database");
    } catch (error) {
      console.error("Database synchronization error:", error.toString());
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error.toString());
    sequelize.close();
  }
};
module.exports = { connectDB, sequelize };
