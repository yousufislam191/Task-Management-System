const createHttpError = require("http-errors");
const sendEmailWithNodamailer = require("./email");

const sendEmail = async (emailData) => {
  try {
    await sendEmailWithNodamailer(emailData);
  } catch (error) {
    throw createHttpError(500, "Failed to send reset passowrd email");
  }
};
module.exports = sendEmail;
