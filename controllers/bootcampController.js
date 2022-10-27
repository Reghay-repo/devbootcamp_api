const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public 
module.exports.getBootcamps = asyncHandler( async (req,res,next) => {
    res.status(200).json(res.advancedResults);
});

// @desc Get a single bootcamp 
// @route GET /api/v1/bootcamps/:id
// @access public 
module.exports.getBootcamp= asyncHandler ( async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

        if(!bootcamp) {
         return  next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));  
        }
        res.status(200).json({success:true,data: bootcamp});
})

// @desc Create a new bootcamp 
// @route POST /api/v1/bootcamps
// @access private 
module.exports.createBootcamp =  asyncHandler(async (req,res,next) => {
    // add user to the req.body
    req.body.user = req.user.id;

    // check if published bootcamp exist
    const publishedBootcamp = await Bootcamp.findOne({user:req.user.id});

    if(publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with the ID ${req.user.id} has already published a bootcamp`, 400))
    }




    const bootcamp = await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       })
   });


// @desc Update a bootcamp 
// @route PUT /api/v1/bootcamps/:id
// @access private 
module.exports.updateBootcamp = asyncHandler( async  (req,res,next) => {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });
    if(!updatedBootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
    }
    res.status(201).json({
        success:true,
        data:updatedBootcamp
    });

});

// @desc Delete a bootcamp 
// @route DELETE /api/v1/bootcamps/:id
// @access private 
module.exports.deleteBootcamp = asyncHandler ( async  (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id,{
        new:true,
        runValidators:true
    });
    if(!bootcamp){ 
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
    }

    bootcamp.remove();
    res.status(200).json({success:true, data:bootcamp})
})

// @desc  get bootcamps within a radius 
// @route GET /api/v1/bootcamps/:zipcode/:distance
// @access private 
module.exports.getBootcampsInRadius = asyncHandler ( async  (req,res,next) => {
    const { zipcode, distance} = req.params;

    // get /lat /long from geocoder

    const location = await geocoder.geocode(zipcode);
    const lat =  location[0].latitude;
    const long =  location[0].longitude;

    // calculate radius using radiants
    // divide dist by radius of earth
    // Earth radius = 3,693 mi / 6,378 km
    const radius = distance / 6378;

    const bootcampsWithingRadius = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [ [ long, lat ], radius ] }
        }
    });

    res.status(200).json({
        success:true,
        count:bootcampsWithingRadius.length,
        data:bootcampsWithingRadius
    })
})



// @desc Upload photo for a bootcamp 
// @route PUT /api/v1/bootcamps/:id/photo
// @access private 
module.exports.bootcampPhotoUpload = asyncHandler ( async  (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id,{
        new:true,
        runValidators:true
    });
    if(!bootcamp){ 
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
    }
    
    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    
    
    const file = req.files.file;
    // make sure file is an image
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    
    if(file.size > process.env.FILE_MAX_UPLOAD){
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.FILE_MAX_UPLOAD}`, 400));
        
    }
    
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    
        // save file name
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    
        res.status(200).json({
          success: true,
          data: file.name
        });

      });
})