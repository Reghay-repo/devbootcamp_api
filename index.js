const express  = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const app = express();


// load dev vars
dotenv.config();

// load body parser
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// connect to db 
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

// import routes
const bootcampsRoutes   = require('./routes/bootcampsRoutes');
const coursesRoutes     = require('./routes/coursesRoutes');
const authRoutes        = require('./routes/authRoutes');


// file upload
app.use(fileupload());




//use routes
app.use('/api/v1/bootcamps',bootcampsRoutes);
app.use('/api/v1/courses',coursesRoutes);
app.use('/api/v1/auth',authRoutes);


app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`running app in ${process.env.NODE_ENV} mode : http://localhost:${PORT}`.yellow.bold);
})


process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(()=> process.exit(1));
})