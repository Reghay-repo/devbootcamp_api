const express       = require('express');
const router        = express.Router({mergeParams:true});
const Course = require('../models/Course');
const advancedQueryResults = require('../middleware/advancedQueryResults')
const { protect } = require('../middleware/auth');
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
    .post(protect,createCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);




module.exports = router;


