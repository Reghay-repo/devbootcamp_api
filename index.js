const express  = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})

// import routes
const bootcampRoutes = require('./routes/bootcampsRoutes')

const app = express();

//load config vars
app.use('/api/v1/bootcamps',bootcampRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`running app in ${process.env.NODE_ENV} mode : http://localhost:${PORT}`);
})
