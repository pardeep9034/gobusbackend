const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    console.log('Sending SMS to:', to);
  try {
    const result = await client.messages.create({
      body: message,
      to: to,          // Example: '+919999999999'
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log('Message sent:', result.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

module.exports = sendSMS;
