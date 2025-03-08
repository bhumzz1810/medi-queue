const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    if (!to) {
      throw new Error("Recipient phone number is missing.");
    }

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to.trim(), // Ensure no spaces or errors in number
    });

    console.log("SMS Sent to", to);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

module.exports = sendSMS;
