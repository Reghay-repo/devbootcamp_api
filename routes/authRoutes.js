// authentication routes
const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/auth');


// register route
router.route('/register')
    .post(registerUser);

    // login route
router.route('/login')
    .post(loginUser);

    // get logged in user
router.route('/currentuser')
    .post(protect,getCurrentUser);

    

    

module.exports = router;    


