import Twilio from 'twilio';
const accountSid = 'AC6eb7b5531f347ffbeffa8a9e196b1300';
const authToken = '0debfc01581bbae78170b011bb0b84f4';
const twilioPhoneNumber = '+17853902239';
const client = Twilio(accountSid, authToken);
export default async function sendSMS(recipientNumber, message) {
    client.messages
    .create({
        body: message,
        from: twilioPhoneNumber,
        to: recipientNumber
    })
    .then(message => console.log(`Message sent. SID: ${message.sid}`))
    .catch(error => console.error(`Error sending SMS: ${error.message}`));
};