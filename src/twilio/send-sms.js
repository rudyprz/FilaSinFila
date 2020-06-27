const config = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);

/**
 * Send an SMS message
 * @param {string} body - The sms message
 * @param {string} phone - The phone number
 */

async function sendMessage(body, phone) {
    try {
        const message = await client.messages.create({
            to: phone,
            from: '+12083699856',
            body
        })
        return message     
    } catch (error) {
        console.log(error)
    }
}

module.exports = {sendMessage}