// authentication controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/asynchandler');
const User          = require('../models/User');


// @desc Register user 
// route /api/v1/auth/register
// access public
exports.registerUser = asyncHandler ( async (req,res,next) =>{
    res.status(200).json({
        success:true
    });
});