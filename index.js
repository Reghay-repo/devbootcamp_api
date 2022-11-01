const express  = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
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

// load cookie parser
app.use(cookieParser());

// To remove data using these defaults:
app.use(mongoSanitize());


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
const userRoutes        = require('./routes/userRoutes');
const reviewRoutes        = require('./routes/reviewRoutes');


// file upload
app.use(fileupload());




//use routes
app.use('/api/v1/bootcamps',bootcampsRoutes);
app.use('/api/v1/courses',coursesRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/reviews',reviewRoutes);


app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`running app in ${process.env.NODE_ENV} mode : http://localhost:${PORT}`.yellow.bold);
})


process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(()=> process.exit(1));
})