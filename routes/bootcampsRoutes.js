const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const {getBootcamp, getBootcamps, deleteBootcamp, updateBootcamp, createBootcamp } = require('../controllers/bootcampController') 


router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

module.exports = router;