const cron = require("node-cron");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const sendEmail = require("./sendEmail");

// Define a cron job to check for tasks due for a reminder
const scheduleTaskReminders = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log(
      "=======***SCHEDULING TASK REMINDERS. IT HAS STARTED***========"
    );
    // Runs every 5 minutes, adjust as needed
    try {
      // Get the current time components
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();

      // Calculate the end time for the reminder (15 minutes from now)
      let endMinute = currentMinute + 15;
      let endHour = currentHour;

      // Adjust for carryover to the next hour
      if (endMinute >= 60) {
        endMinute -= 60;
        endHour += 1;
      }

      // Ensure endHour stays within 12-hour format
      endHour %= 12;
      endHour = endHour || 12; // Convert 0 to 12 for 12 AM

      // Adjust for PM if endHour is in the afternoon
      const endPartOfDay = endHour < 12 ? "PM" : "AM";

      // Find tasks due within the next 15 minutes
      const tasks = await Task.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                // Tasks due within the next 15 minutes
                {
                  hour: endHour,
                  minute: {
                    [Op.between]: [endMinute - 15, endMinute],
                  },
                  partOfDay: endPartOfDay,
                },
                // Tasks due in the next hour if the current time is at the end of the hour
                {
                  hour: endHour + 1,
                  minute: {
                    [Op.lt]: 15, // If less than 15 minutes past the hour
                  },
                  partOfDay: endPartOfDay,
                },
              ],
            },
            { reminderSent: false },
          ],
        },
      });

      // Send reminder emails for each task
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

module.exports = { scheduleTaskReminders };
