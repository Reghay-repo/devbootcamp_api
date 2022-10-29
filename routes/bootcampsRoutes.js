const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const {protect, authorize} = require('../middleware/auth');
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
const reviewRouter = require('./reviewRoutes');

// re-route to course router if we hit this route
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/:id/photo')
    .put(protect,authorize('publisher','admin'), bootcampPhotoUpload);


router.route('/')
    .get( advancedQueryResults(Bootcamp,'courses'),getBootcamps)
    .post(protect, authorize('publisher','admin'),createBootcamp)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id')
    .get(getBootcamp)
    .put(protect ,authorize('publisher','admin') ,updateBootcamp)
    .delete(protect, authorize('publisher','admin'),deleteBootcamp);


module.exports = router;