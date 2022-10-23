const express = require('express');
const router = express.Router();
const {getBootcamp, 
        getBootcamps, 
        deleteBootcamp,
        updateBootcamp, 
        bootcampPhotoUpload,
        getBootcampsInRadius,
         createBootcamp } = require('../controllers/bootcampController') 

// course router
const courseRouter = require('./coursesRoutes');

// re-route to course router if we hit this route
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);


router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)


module.exports = router;