const express       = require('express');
const router        = express.Router();
const User = require('../models/User');
const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}  = require('../controllers/userController');

// middlewares
const advancedQueryResults = require('../middleware/advancedQueryResults')
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(advancedQueryResults(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);




module.exports = router;


