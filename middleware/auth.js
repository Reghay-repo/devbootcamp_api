const jwt           = require('jsonwebtoken');
const asyncHandler  = require('./asynchandler');
const User          = require('../models/User');
const ErrorResponse  = require('../utils/errorResponse'); 


// protection middleware
exports.protect = asyncHandler( async (req,res,next) => {
    
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {

        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.token) {
        token = req.cookies.token;

    }

    // make sure token exist
    if(!token) {
        return next(new ErrorResponse('Not authorized.', 401));    
    }
    
    try {
        // verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        //  get user with the id 
        req.user = await User.findById(decodedToken.id);
        
        console.log(decodedToken);
        console.log(req.user);
        
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized.', 401));    
    }
    
});



exports.authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role ${req.user.role} not authorized to access this route.`, 403));    
        }
        next();
    }
}