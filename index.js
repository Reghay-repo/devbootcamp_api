const express  = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();


// load body parser
app.use(express.json());

// load dev vars
dotenv.config({path:'./config/config.env'});


// connect to db 
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

// import routes
const bootcampRoutes = require('./routes/bootcampsRoutes')





//use routes
app.use('/api/v1/bootcamps',bootcampRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`running app in ${process.env.NODE_ENV} mode : http://localhost:${PORT}`.yellow.bold);
})


process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(()=> process.exit(1));
})