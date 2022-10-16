const mongoose = require('mongoose');
const colors = require('colors');
const fs = require('fs');

// load models
const Bootcamp = require('./models/Bootcamp');

// load environement variables
require('dotenv').config({path:'./config/config.env'});



// connect to mongodb 
mongoose.connect(process.env.MONGO_URI);

// load data form file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));



// import to DB
const importToDB = async () => {
    try {
        await Bootcamp.insertMany(bootcamps);
        console.log('Data imported succesfully!'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err)
    }
}


// import to DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany({});
        console.log('Data deleted succesfully!'.red.inverse);
        process.exit();
    } catch (err) {
        console.err(err)
    }
}



if(process.argv[2] === '-i') {
    importToDB();
} else if (process.argv[2] === '-d') {
    deleteData();
}
