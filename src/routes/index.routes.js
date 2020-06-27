const {Router} = require('express');
const router = Router();

const {indexController, postMessage, receiveMessage, createUser, updateUser, sendCodeNumber, verifyCodeNumber} = require('../controllers/index.controller')

// Create User
router.post('/new-user', createUser);

// Send Code to Phone
router.post('/send-code', sendCodeNumber);

// Verify Code Phone
router.post('/verify-code', verifyCodeNumber);

//Update User
router.post('/update-user/:id', updateUser)

// Main Routes
router.get('/', indexController);

// Send a SMS
router.post('/send-sms', postMessage);

// Receive an SMS
router.post('/sms', receiveMessage);

module.exports = router;