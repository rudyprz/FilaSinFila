const {Router} = require('express');
const router = Router();

const {indexController, postMessage, postWhatsapp, receiveMessage, loginUser, forgotPass, resetPass, createUser, createOwner, createBusiness, createAssociate, searchTel, searchUser, searchOwner, updateUser, updateOwner, updateBusiness, updateAssociate, updateAssociatePass, deleteBusiness, deleteAssociate, checkInBusiness, checkOutBusiness, changeMax, addTokens, generateQR, detectQR, getUser, getOwner, getAssociate, getBusiness, getListBusiness, getListAssociates, takeTurn, getTurn, dropTurn, sendCodeNumber, verifyCodeNumber, rateBusiness, paymentIntent} = require('../controllers/index.controller')

// Set Payment
router.post('/payment-intent', paymentIntent);

// Create User
router.post('/new-user', createUser);

// Create Owner
router.post('/new-owner', createOwner);

// Create Associate
router.post('/new-associate', createAssociate);

// Create Business
router.post('/new-business', createBusiness);

router.post('/search-tel', searchTel);
router.post('/search-user', searchUser);
router.post('/search-owner', searchOwner);

// Login User
router.post('/login-user', loginUser);

// Forgot Pass
router.post('/forgot-pass', forgotPass);

// Reset Pass
router.post('/reset-pass', resetPass);

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

//Update Associate
router.post('/update-associate/:id', updateAssociate);

//Update Associate Pass
router.post('/update-associate-pass/:id', updateAssociatePass);

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

//Get List Business
router.get('/get-list-business/:id', getListBusiness);

//Get List Business
router.get('/get-list-associates/:id', getListAssociates);

//Take Turn
router.post('/take-turn/:id', takeTurn);

//Get Turn Status
router.get('/get-turn/:id', getTurn);

//Drop Turn
router.post('/drop-turn/:id', dropTurn);

// Send a SMS
router.post('/send-sms', postMessage);

// Send WhatsApp
router.post('/send-wapp', postWhatsapp);

// Receive an SMS
router.post('/sms', receiveMessage);

// Rate Business
router.post('/rate-business', rateBusiness);

// Main Routes
router.get('/', indexController);


module.exports = router;