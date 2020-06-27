const config = require('../config');
const client = require('twilio')(config.accountSid, config.authToken);

/**
 * Send an SMS message
 * @param {string} code - The code to verify
 * @param {string} phone - The phone number
 */


 
function sendCode(phone) {
    console.log("PHONE: " + phone)
    client.verify.services('VA45fe8e9ce95313de260a1b9beef9e874')
        .verifications
        .create({to: phone, channel: 'sms'})
        .then(verification => {
            console.log('Status funcion:' + verification.status)
            return verification.status
        });    
}

function verifyCode(phone, code) {
    client.verify.services('VA45fe8e9ce95313de260a1b9beef9e874')
        .verificationChecks
        .create({to: phone, code: code})
        .then(verification_check => {
            console.log(verification_check.status)
            return verification_check.status
        });
}

module.exports = {sendCode, verifyCode}