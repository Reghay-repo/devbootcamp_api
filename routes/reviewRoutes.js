const express       = require('express');
const router        = express.Router({mergeParams:true});
const Review = require('../models/Review');
const {
    getUsers, getReviews,
}  = require('../controllers/reviewController');

// middlewares
const advancedQueryResults = require('../middleware/advancedQueryResults')
const {protect, authorize} = require('../middleware/auth');


router.route('/')
    .get(advancedQueryResults(Review,{
        path:'bootcamp',
        select: 'name description'
    }), getReviews);

// router.route('/:id')
//     .put(updateUser)
//     .delete(deleteUser);




module.exports = router;


