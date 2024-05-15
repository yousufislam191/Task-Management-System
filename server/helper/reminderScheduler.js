const cron = require("node-cron");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const sendEmail = require("./sendEmail");
const FailedTask = require("../models/failedTask.model");
const { sequelize } = require("../config/db");

/*
# ┌────────────── second (optional)
# │ ┌──────────── minute
# │ │ ┌────────── hour
# │ │ │ ┌──────── day of month
# │ │ │ │ ┌────── month
# │ │ │ │ │ ┌──── day of week
# │ │ │ │ │ │
# │ │ │ │ │ │
# * * * * * *
*/

// Define a cron job to check for tasks due for a reminder
const scheduleTaskReminders = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("=======***SCHEDULING TASK REMINDERS. IT HAS STARTED***======");

    try {
      const now = new Date();
      const targetMinute = (now.getMinutes() + 15) % 60;
      const targetHour =
        (now.getHours() + Math.floor((now.getMinutes() + 15) / 60)) % 24;

      const tasks = await Task.findAll({
        where: {
          [Op.and]: [
            {
              hour: targetHour,
              minute: { [Op.between]: [targetMinute - 15, targetMinute] },
            },
            { status: [0, 1] }, // Scheduled or Pending
            { reminderSent: false },
          ],
        },
      });

      tasks.forEach(async (task) => {
        await sendTaskReminderEmail(task);
        await Task.update({ reminderSent: true }, { where: { id: task.id } });
      });
    } catch (error) {
      console.error("Error scheduling task reminders:", error);
    }
  });
};

// Function to send a reminder email for a task
const sendTaskReminderEmail = async (task) => {
  try {
    // Construct email data
    const emailData = {
      email: task.email,
      subject: "Task Reminder",
      text: `Reminder: Your task "${task.title}" is due in 15 minutes.`,
      html: `<p>Reminder: Your task "${task.title}" is due in 15 minutes.</p>`,
    };

    // Send email
    await sendEmail(emailData);
    console.log("Reminder email sent for task:", task.id);
  } catch (error) {
    console.error("Error sending task reminder email:", error);
  }
};

// Function to move failed tasks from the newTask table to the failedTask table
const movedFailedTaskRemindersSchedule = (req, res, next) => {
  cron.schedule("*/1 * * * *", async () => {
    console.log(
      "========***CHECKING FOR FAILED TASKS AND MOVING...***=========="
    );
    const now = new Date();
    const formattedMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    const formattedDate = ("0" + now.getDate()).slice(-2);
    const date = `${now.getFullYear()}-${formattedMonth}-${formattedDate}`;
    let transaction;

    try {
      const failedTasks = await Task.findAll({
        where: {
          [Op.and]: [
            { status: { [Op.in]: [0, 1] } },
            {
              [Op.or]: [
                { deadline: { [Op.lt]: date } }, // Strictly before from current date
                {
                  deadline: { [Op.eq]: date },
                  hour: { [Op.lt]: now.getHours() },
                },
                {
                  deadline: { [Op.eq]: date }, // strictly before from current date and hour and minute
                  hour: { [Op.eq]: now.getHours() },
                  minute: { [Op.lt]: now.getMinutes() },
                },
              ],
            },
          ],
        },
        order: [
          ["deadline", "ASC"],
          ["hour", "ASC"],
          ["minute", "ASC"],
        ],
      });

      if (failedTasks.length !== 0) {
        // Start a transaction if there are failed tasks to process
        transaction = await sequelize.transaction();

        const failedTasksAttributes = failedTasks.map((task) => ({
          email: task.email,
          title: task.title,
          tag: task.tag,
          description: task.description,
          deadline: task.deadline,
          hour: task.hour,
          minute: task.minute,
          createdByTask: task.createdByTask,
          createdToTask: task.createdToTask,
          reminderSent: task.reminderSent,
        }));

        // Insert failedTasks into FailedTask table
        await FailedTask.bulkCreate(failedTasksAttributes, { transaction });

        // Delete failedTasks from Task table
        await Task.destroy({
          where: { id: failedTasks.map((task) => task.id) },
          transaction,
        });

        // Commit the transaction if everything is successful
        await transaction.commit();
        console.log("Failed tasks moved successfully");
      } else {
        // No failed tasks to process
        console.log("No failed tasks available to move.");
      }
    } catch (error) {
      // Rollback the transaction if an error occurs
      if (transaction) await transaction.rollback();
      console.error("Error moving failed tasks:", error);
      next(error);
    }
  });
};

module.exports = { scheduleTaskReminders, movedFailedTaskRemindersSchedule };
