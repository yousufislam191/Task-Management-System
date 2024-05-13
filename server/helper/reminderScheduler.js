const cron = require("node-cron");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const sendEmail = require("./sendEmail");
const FailedTask = require("../models/failedTask.model");

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
      const endPartOfDay = endHour < 12 ? "AM" : "PM";

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
            {
              status: {
                [Op.or]: [1, 2],
              },
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

// Function to move failed tasks from the newTask table to the failedTask table
const movedFailedTaskRemindersSchedule = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("========***Checking for failed tasks...***==========");

    try {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const isAM = currentHour < 12;

      const failedTasks = await Task.findAll({
        where: {
          [Op.and]: [
            {
              deadline: {
                [Op.lte]: new Date(),
              },
            },
            {
              status: {
                [Op.or]: [0, 1, 2],
              },
            },
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    {
                      partOfDay: "AM",
                      hour: {
                        [Op.lte]: isAM ? currentHour : currentHour - 12,
                      },
                      minute: {
                        [Op.lt]: currentMinute,
                      },
                    },
                  ],
                },
                {
                  [Op.and]: [
                    {
                      partOfDay: "PM",
                      hour: {
                        [Op.lte]: isAM ? currentHour + 12 : currentHour,
                      },
                      minute: {
                        [Op.lt]: currentMinute,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
      console.log("ffailedTasks", failedTasks);

      if (failedTasks.length !== 0) {
        console.log("failedTasks.id", failedTasks);
        const insertData = failedTasks.map((task) => ({
          taskId: task.id,
          email: task.email,
          title: task.title,
          tag: task.tag,
          description: task.description,
          deadline: task.deadline,
          hour: task.hour,
          minute: task.minute,
          partOfDay: task.partOfDay,
          createdByTask: task.createdByTask,
          createdToTask: task.createdToTask,
          reminderSent: task.reminderSent,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }));

        try {
          const result = await FailedTask.bulkCreate(insertData);

          // Delete failed tasks from the newTask table
          if (result) {
            await Task.destroy({
              where: {
                status: { [Op.eq]: 0 },
                deadline: { [Op.lte]: new Date() },
              },
            });
            console.log("Failed tasks moved successfully.");
          }
        } catch (error) {
          console.error("Error creating failed tasks:", error);
        }
      }
    } catch (error) {
      console.error("Error moving failed tasks:", error);
    }
  });
};

module.exports = { scheduleTaskReminders, movedFailedTaskRemindersSchedule };
