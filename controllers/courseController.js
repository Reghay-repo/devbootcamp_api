const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
const Course = require('../models/Course');


// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public 
exports.getCourses = asyncHandler( async(req,res,next) => {
    let query;
    const {bootcampId} = req.params;

    if(bootcampId){
        query = Course.find({bootcamp:bootcampId})
    } else {
        query = Course.find();
    }

    const courses = await query;


    res.status(200).json({
        success: true,
        count: courses.length,
        data:courses
    })
})