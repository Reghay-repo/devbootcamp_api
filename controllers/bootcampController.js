const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/asynchandler');
const geocoder = require('../utils/geocoder');



// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public 
module.exports.getBootcamps = asyncHandler( async (req,res,next) => {
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));
    
    const bootcamps = await query;
    res.status(200).json({ success: true,count:bootcamps.length, data: bootcamps})
});

// @desc Get a single bootcamp 
// @route GET /api/v1/bootcamps/:id
// @access public 
module.exports.getBootcamp= asyncHandler ( async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp) {
         return  next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));  
        }
        res.status(200).json({success:true,data: bootcamp});
})

// @desc Create a new bootcamp 
// @route POST /api/v1/bootcamps
// @access private 
module.exports.createBootcamp =  asyncHandler(async (req,res,next) => {
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id,{
        new:true,
        runValidators:true
    });
    if(!bootcamp){ 
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404));
    }
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
    // divide dist by radiusof earth
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