const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asynchandler");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
  console.log(req.params.bootcampId);
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route GET /api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`no review found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});


// @desc Create review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access private
exports.createReview = asyncHandler(async (req, res, next) => {
  // get the bootcamp id from params
  req.body.bootcamp = req.params.bootcampId;
  // get the user id from req
  req.body.user = req.user.id;
  // create user
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `no bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});




// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access private
exports.updateReview = asyncHandler(async (req, res, next) => {
  
    // find review
    const review =  await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(
          `no review found with id ${req.params.id}`,
          404
        )
      );
    }
    
    if(review.user.toString() !== req.user && req.user.role !== 'admin') {
        return next(
          new ErrorResponse(
            `user not authorized to update review ${req.params.id}`,
            401
          )
        );

    }
  
   review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators:true
  })

    res.status(201).json({
      success: true,
      data: review,
    });
  });
  


// @desc Delete review
// @route DELETE /api/v1/reviews/:id
// @access private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorResponse(`no review with id ${req.params.id}`,404))
    }
    
    // make sure review belongs to user or user with admin 
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user not authorized to delete review ${req.params.id}`,401));

    }

    await review.remove();


    res.status(200).json({
        success:true,
        data:{}
    });

});
  