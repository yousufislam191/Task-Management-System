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

// Create the database if it doesn't exist
const createDatabase = async () => {
  const connection = mysql2.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUserName,
    password: dbPass,
  });

  try {
    await connection
      .promise()
      .query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
    console.log("Database created successfully or already exists.");
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    connection.end();
  }
};

const connectDB = async () => {
  try {
    // Create the database if it doesn't exist
    await createDatabase();

    // Use the created database for Sequelize connection
    sequelize.options.database = dbName;

    // Try to authenticate
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Try to synchronize the User model with the database
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
