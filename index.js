const express  = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const app = express();


// load dev vars
dotenv.config();

// load body parser
app.use(express.json());



// connect to db 
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

// import routes
const bootcampsRoutes   = require('./routes/bootcampsRoutes')
const coursesRoutes     = require('./routes/coursesRoutes')





//use routes
app.use('/api/v1/bootcamps',bootcampsRoutes);
app.use('/api/v1/courses',coursesRoutes);

app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`running app in ${process.env.NODE_ENV} mode : http://localhost:${PORT}`.yellow.bold);
})


process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(()=> process.exit(1));
})