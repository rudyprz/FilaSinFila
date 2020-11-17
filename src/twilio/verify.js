const config = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);

/**
 * Send an SMS message
 * @param {string} code - The code to verify
 * @param {string} phone - The phone number
 */


 
async function sendCode(phone) {
    console.log("PHONE: " + phone)
    try {
        const verification = await client.verify.services('VAa15f7177d578dae6f3025b2958568ded').verifications.create({to: phone, channel: 'sms'})
        console.log('Status funcion:' + verification.status)
        return verification
    } catch (error) {
        console.log(error)
    }
}

async function verifyCode(phone, code) {
    try {
        const verification_check = await client.verify.services('VAa15f7177d578dae6f3025b2958568ded').verificationChecks.create({to: phone, code: code})
        console.log(verification_check.status)
        return verification_check
    } catch (error) {
        console.log(error)
    }
}

module.exports = {sendCode, verifyCode}