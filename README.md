# Node/Express/Mongoose Dev bootcamp backend API


> ### Backend API (Express + Mongoose) for Bootcamps (CRUD, auth, advanced patterns, etc)



![alt text] (https://github.com/Reghay-repo/devbootcamp_api/blob/main/snapshots/snap1.png)

![alt text] (https://github.com/Reghay-repo/devbootcamp_api/blob/main/snapshots/snap2.png

# Getting started

To get the Node server running locally:

- Clone this repo
## Clone this repo

    git clone https://github.com/Reghay-repo/devbootcamp_api.git

## install all required dependencies

    npm install
    


## Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`

    mongod
    

## start the local server

    npm run dev




## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Middleware for validating JWTs for authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [bcryptjs](https://github.com/kelektiv/node.bcrypt.js/) - A library to help you hash passwords.
- [cors](https://github.com/kelektiv/node.bcrypt.js/) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [express-fileupload](https://github.com/richardgirges/express-fileupload) - Simple express middleware for uploading files.
- [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize) - SExpress 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - Basic rate-limiting middleware for Express. 
- [mongoose](https://github.com/Automattic/mongoose) -Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
- [node-geocoder](https://github.com/nchaulet/node-geocoder) -Node library for geocoding and reverse geocoding. 


## Application Structure

- `index.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for db.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `controller/` - This folder contains the controllers where we perform our business logic.
- `utils/` - This folder contains helpers such as sending email, and our geo coding api logic handler.
- `_data/` - This folder contains data for our seeder function to make fake data for the project.

## Error Handling

In `middleware/error.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT token . We define two express middlewares in `middleware/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.


<br />

