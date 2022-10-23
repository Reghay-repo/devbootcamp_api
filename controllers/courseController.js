const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public 
exports.getCourses = asyncHandler( async(req,res,next) => {
    const {bootcampId} = req.params;

    if(bootcampId){
        const courses = await  Course.find({bootcamp:bootcampId})
        res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
})

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access public 
exports.getCourse = asyncHandler( async(req,res,next) => {

    const course = await Course.find({_id: req.params.id})

    res.status(200).json({
        success: true,
        data:course
    })
})




// @desc Create  course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.createCourse = asyncHandler( async(req,res,next) => {

    
    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
        path:'courses',
        select: 'title description'
    });
    
    if(!bootcamp){ 
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 404));
    }
    
    req.body.bootcamp = req.params.bootcampId

    const course = await Course.create(req.body);


    res.status(200).json({
        success: true,
        data:course
    })

});



// @desc Delete  course
// @route DELETE /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler( async(req,res,next) => {

    const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});



// @desc Update  course
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler( async(req,res,next) => {

    const course = await Course.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true
      });

    if(!course){ 
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data:course
    });

});

