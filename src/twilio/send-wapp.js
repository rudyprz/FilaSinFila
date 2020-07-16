const config = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);

/**
 * Send an Whatsapp message
 * @param {string} body - The sms message
 * @param {string} phone - The phone number
 */

async function sendWhatsapp(body, phone) {
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            body: body,
            to: 'whatsapp:' + phone,
        })
        return message     
    } catch (error) {
        console.log(error)
    }
}

module.exports = {sendWhatsapp}