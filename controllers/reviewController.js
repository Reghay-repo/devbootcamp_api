const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
const Review = require('../models/Review');


// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public 
exports.getReviews = asyncHandler( async(req,res,next) => {

    console.log(req.params.bootcampId)
    if(req.params.bootcampId) {
        const reviews = await Review.find({bootcamp: req.params.bootcampId});
            res.status(200).json({
                success:true,
                count:reviews.length,
                data:reviews
            });
    } else  {
        res.status(200).json(res.advancedResults);
    }


})