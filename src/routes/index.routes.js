const {Router} = require('express');
const router = Router();

const {indexController, postMessage, postWhatsapp, receiveMessage, loginUser, createUser, createOwner, createBusiness, createAssociate, updateUser, updateOwner, updateBusiness, deleteBusiness, deleteAssociate, checkInBusiness, checkOutBusiness, changeMax, addTokens, generateQR, detectQR, getUser, getOwner, getAssociate, getBusiness, takeTurn, dropTurn, sendCodeNumber, verifyCodeNumber} = require('../controllers/index.controller')

// Create User
router.post('/new-user', createUser);

// Create Owner
router.post('/new-owner', createOwner);

// Create Associate
router.post('/new-associate', createAssociate);

// Create Business
router.post('/new-business', createBusiness);

// Login User
router.post('/login-user', loginUser);

// Send Code to Phone
router.post('/send-code', sendCodeNumber);

// Verify Code Phone
router.post('/verify-code', verifyCodeNumber);

//Update User
router.post('/update-user/:id', updateUser);

//Update Owner
router.post('/update-owner/:id', updateOwner);

//Update Business
router.post('/update-business/:id', updateBusiness);

//Delete Business
router.post('/delete-business/:id', deleteBusiness);

//Delete Associate
router.post('/delete-associate/:id', deleteAssociate);

//Get User Details
router.get('/get-user/:id', getUser);

//Get Owner Details
router.get('/get-owner/:id', getOwner);

//Get Associate Details
router.get('/get-associate/:id', getAssociate);

//Check In
router.post('/check-in/:id', checkInBusiness);

//Check Out
router.post('/check-out/:id', checkOutBusiness);

//Change Max Persons
router.post('/change-max/:id', changeMax);

//Add Tokens
router.post('/add-tokens/:id', addTokens);

//Generate QR
router.get('/generate-qr', generateQR);

//Detect QR
router.get('/detect-qr/:id', detectQR);

//Get Business
router.get('/get-business/:id', getBusiness);

//Take Turn
router.post('/take-turn/:id', takeTurn);

//Drop Turn
router.post('/drop-turn/:id', dropTurn);

// Send a SMS
router.post('/send-sms', postMessage);

// Send WhatsApp
router.post('/send-wapp', postWhatsapp);

// Receive an SMS
router.post('/sms', receiveMessage);

// Main Routes
router.get('/', indexController);

module.exports = router;