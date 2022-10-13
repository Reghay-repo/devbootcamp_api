const errorResponse = require('../utils/errorResponse');
const errorHandler = (err,req,res,next) => {

    // log to console dev
    console.log(err.errors);
    let error = { ...err };
    error.message = err.message;


 // mongodb bad ObjectId
 // creating an error
if(err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new errorResponse  (message,404);
}

// mongoose duplicate error
if(err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new errorResponse(message,400)
}
// mongoose validation error
if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new errorResponse(message,400);
}
    res.status(error.statusCode || 500).json({
        success:false,
        error: error.message || 'Server error'
    });
}

module.exports = errorHandler;