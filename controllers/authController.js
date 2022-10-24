// authentication controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/asynchandler');
const User          = require('../models/User');


// @desc Register user 
// route /api/v1/auth/register
// access public
exports.registerUser = asyncHandler ( async (req,res,next) =>{
    //   get the user fields
    const {name, email,password,role} = req.body;

    //create user object 
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // return user
    res.status(200).json({
        success:true
    });

});