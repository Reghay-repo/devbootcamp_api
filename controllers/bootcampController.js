const Bootcamp = require('../models/Bootcamp')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public 
module.exports.getBootcamps = async (req,res,next) => {
   try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps})
} catch (error) {
    
    res.status(400).json({ success: false})
   }
}

// @desc Get a single bootcamp 
// @route GET /api/v1/bootcamps/:id
// @access public 
module.exports.getBootcamp= async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp) {
            
           return  res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data: bootcamp});
    } catch (err) {
        
        res.status(400).json({success:false});
    }   
}

// @desc Create a new bootcamp 
// @route POST /api/v1/bootcamps
// @access private 
module.exports.createBootcamp = async (req,res,next) => {
 try{
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success:true,
        data:bootcamp
    })
 } catch(e) {
    res.status(400).json({
        success:false
    })
 }
}


// @desc Update a bootcamp 
// @route PUT /api/v1/bootcamps/:id
// @access private 
module.exports.updateBootcamp = (req,res,next) => {
    res.status(200).send({
        success: true,
        msg:`update a  bootcamp ${req.params.id}`,
    })
}

// @desc Delete a bootcamp 
// @route DELETE /api/v1/bootcamps/:id
// @access private 
module.exports.deleteBootcamp = (req,res,next) => {
    res.status(200).send({
        success: true,
        msg:`delete a  bootcamp ${req.params.id}`,
    })
}