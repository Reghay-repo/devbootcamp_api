const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const {protect} = require('../middleware/auth');
const advancedQueryResults = require('../middleware/advancedQueryResults');
const {getBootcamp, 
        getBootcamps, 
        deleteBootcamp,
        updateBootcamp, 
        bootcampPhotoUpload,
        getBootcampsInRadius,
         createBootcamp } = require('../controllers/bootcampController');

// course router
const courseRouter = require('./coursesRoutes');

// re-route to course router if we hit this route
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo')
    .put(protect, bootcampPhotoUpload);


router.route('/')
    .get( advancedQueryResults(Bootcamp,'courses'),getBootcamps)
    .post(protect, createBootcamp)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id')
    .get(getBootcamp)
    .put(protect ,updateBootcamp)
    .delete(protect ,deleteBootcamp);


module.exports = router;