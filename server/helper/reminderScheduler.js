const cron = require("node-cron");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const sendEmail = require("./sendEmail");
const FailedTask = require("../models/failedTask.model");

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
            { status: [1, 2] }, // Scheduled or Pending
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
const movedFailedTaskRemindersSchedule = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log(
      "========***CHECKING FOR FAILED TASKS AND MOVING...***=========="
    );

    try {
      const date = new Date().toISOString().slice(0, 10); // Assuming local time zone
      const now = new Date();

      const failedTasks = await Task.findAll({
        where: {
          [Op.and]: [
            { status: { [Op.ne]: 3 } },
            {
              [Op.or]: [
                {
                  deadline: { [Op.lt]: date }, // Strictly before adjusted time
                },
                {
                  deadline: { [Op.eq]: date }, // Only date part
                  [Op.and]: [
                    {
                      [Op.or]: [
                        {
                          hour: { [Op.lt]: now.getHours() },
                        },
                        {
                          hour: { [Op.eq]: now.getHours() },
                          [Op.and]: [
                            {
                              minute: { [Op.lt]: now.getMinutes() },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      if (failedTasks.length !== 0) {
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

        const tasksToInsert = [];
        for (const data of insertData) {
          const existing = await FailedTask.findOne({
            where: { taskId: data.taskId },
          });
          if (!existing) {
            tasksToInsert.push(data);
          }
        }

        if (tasksToInsert.length > 0) {
          const result = await FailedTask.bulkCreate(tasksToInsert);
          if (result) {
            console.log("Failed tasks moved successfully");
          }
        } else {
          console.log("No new failed tasks to insert.");
        }
      }
    } catch (error) {
      console.error("Error moving failed tasks:", error);
    }
  });
};

module.exports = { scheduleTaskReminders, movedFailedTaskRemindersSchedule };
