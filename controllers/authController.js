// authentication controller
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/asynchandler');
const User          = require('../models/User');


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

    // ====================old way=========
    // // create token 
    // const token = user.getSignedJwtToken();


    // // return user
    // res.status(200).json({
    //     success:true,
    //     token
    // });

    // =================new way=============
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

    // ====================old way=========
    // // create token 
    // const token = user.getSignedJwtToken();


    // // return user
    // res.status(200).json({
    //     success:true,
    //     token
    // });

    // =================new way=============
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
