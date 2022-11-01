// authentication routes
const express = require('express');
const { registerUser, loginUser, getCurrentUser, forgotPassword, resetPassword, updateUserDetails, updateUserPassword, logout } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/auth');


// register route
router.route('/register')
    .post(registerUser);

    // login route
router.route('/login')
    .post(loginUser);

    // logout route
router.route('/logout')
    .get(logout);

    // get logged in user
router.route('/currentuser')
    .post(protect,getCurrentUser);
    
    // update user details
router.route('/updatedetails')
    .put(protect,updateUserDetails);


    // update password
router.route('/updatepassword')
    .put(protect,updateUserPassword);

    // forgot password 
router.route('/forgotpassword')
    .post(forgotPassword);

    
    // reset password 
router.route('/resetpassword/:resettoken')
    .put(resetPassword);

    

    

module.exports = router;    


