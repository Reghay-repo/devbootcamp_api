// authentication controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/asynchandler');
const User          = require('../models/User');
const crypto        = require('crypto');
const sendEmail     =require('../utils/sendEmail');


// @desc Register user 
// route POST /api/v1/auth/register
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

    sendTokenResponse(user,200,res);

});


// @desc Login user 
// route  POST /api/v1/auth/login
// access public
exports.loginUser = asyncHandler ( async (req,res,next) =>{


    //   get the user fields
    const {email,password} = req.body;

    //validate  email & password 
    if(!email || !password) {
        return next(new ErrorResponse('Please add email and password', 400));
    }
    
    
    // search for user 
    const user = await User.findOne({email}).select('+password');
    
    // check if user exist
    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
        
    }
    
    // check if password matches
    const isMatch = await user.matchPassword(password);
    
    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));

    }



    sendTokenResponse(user, 200,res);

});




// @desc Register user 
// route POST /api/v1/auth/register
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


    sendTokenResponse(user,200,res);

});


// @desc Get current logged in user
// route  GET /api/v1/auth/currentuser
// access private
exports.getCurrentUser = asyncHandler ( async (req,res,next) => {

    //get user from the req.user.id
    const user = await User.findById(req.user.id);


    res.status(200).json({
        success:true,
        data:user
    });

});


// @desc Forgot password
// route  POST /api/v1/auth/forgotpassword
// access public
exports.forgotPassword = asyncHandler ( async (req,res,next) => {

    // find user by email
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(
            new ErrorResponse('There is no user with this email', 404 )
        );
    }

    // get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    // create message
    const message = `You are recieving this email because you (or someone else) has
    requested the reset of a password. please make a PUT request to: \n\n ${resetUrl}`;


    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })

        res.status(200).json({
            success:true,
            data:'Email sent'
        });
    } catch (err) {

        console.log(err);
        user.resePasswordToken      = undefined;
        user.resetPasswordExpire    = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorResponse('email could not be sent',500));
    }


    res.status(200).json({
        success:true,
        data:user
    });

});
// @desc Reset password
// route  PUT /api/v1/auth/resetpassword/:resettoken
// access public
exports.resetPassword = asyncHandler ( async (req,res,next) => {

    // get hashed token
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    // find user by reset token    
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });

    if(!user) {
        return next(
            new ErrorResponse('Invalid token',400)
        )
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();


    sendTokenResponse(user,200,res);
});





// get token from model
// create cookie and send response
const sendTokenResponse = (user,statusCode,res) => {
    // create token 
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 *60 *1000),
        httpOnly:true    
    }


    // secure if in production
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    });
}
