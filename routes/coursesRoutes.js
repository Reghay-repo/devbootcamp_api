const express       = require('express');
const router        = express.Router({mergeParams:true});
const Course = require('../models/Course');
const advancedQueryResults = require('../middleware/advancedQueryResults')
const {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse
}  = require('../controllers/courseController');



router.route('/')
    .get(advancedQueryResults(Course, {
        path:'bootcamp',
        select: 'name description'
    }),getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)




module.exports = router;


