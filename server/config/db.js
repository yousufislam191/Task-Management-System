// const mysql = require("mysql2");
const { Sequelize } = require("sequelize");
const { dbHost, dbUserName, dbPass, dbName } = require("../secret");

// ============ for MySQL with Sequelize Connetion ============
const sequelize = new Sequelize(dbName, dbUserName, dbPass, {
  host: dbHost,
  dialect: "mysql",
  operatorsAliases: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

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

// ============ for MySQL Connetion ============
// Create a MySQL database connection
// const db = mysql.createConnection({
//   host: dbHost, // Your MySQL server host
//   user: dbUserName,
//   password: dbPass,
//   database: dbName,
// });

// const connectDB = async () => {
//   try {
//     // Connect to the database
//     await db.connect((err) => {
//       if (err) {
//         console.error("Database connection error:", err);
//       } else {
//         console.log("Connected to MySQL database");
//       }
//     });
//   } catch (error) {
//     console.error("Could not connect to Database: ", error.toString());
//   }
// };
module.exports = { connectDB, sequelize };
