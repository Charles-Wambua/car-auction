const twilio = require('twilio');

const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

exports.sendWhatsAppMessage = async (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${phoneNumber}`
    });
};
