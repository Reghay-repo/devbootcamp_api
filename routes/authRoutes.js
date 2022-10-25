// authentication routes
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();



// register route
router.route('/register')
    .post(registerUser);
// login route
router.route('/login')
    .post(loginUser);

    

    

module.exports = router;    


