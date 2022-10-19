
// load environement variables
require('dotenv').config();

const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');

// load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');



// connect to mongodb 
mongoose.connect(process.env.MONGO_URI);

// load data form file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));



// import to DB
const importToDB = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data imported succesfully!'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err)
        process.exit();
    }
}


// import to DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany({});
        await Course.deleteMany({});
        console.log('Data deleted succesfully!'.red.inverse);
        process.exit();
    } catch (err) {
        console.err(err)
    }
}

const refreshData = async () => {
    try {
        await Bootcamp.deleteMany({});
        await Course.deleteMany({});
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data refreshed succesfully!'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err)
        process.exit();
    }
}


if(process.argv[2] === '-i') {
    importToDB();
} else if (process.argv[2] === '-d') {
    deleteData();
} else if (process.argv[2] === '-r') {
    refreshData();
}
