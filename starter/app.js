const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require(`${__dirname}/utils/globalError`);

// const { json } = require('express');

//setting env variables
dotenv.config({
  path: `${__dirname}/config.env`,
});

const tourRouter = require(`./routes/tour-router`);
const userRouter = require(`./routes/user-router`);

const app = express();

// console.log(process.env);
console.log(app.get('env'));
console.log(process.env.USERNAME);
////////////////// GLOBAL MIDDLE WARES

//overview.html middleware

// SECURITY HTTP HEADER
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: 'Too many request from this Ip, try again in an hour',
});

/// LIMIT REQUEST FROM SAME API
app.use('/api', limiter);

// BODY PARSER , READING DATA FROM BODY INTO REQ.BODY
app.use(express.json());

// TO TOUR ROUTES
app.use('/api/v1/tours', tourRouter);

// TO USER ROUTERS
app.use('/api/v1/users', userRouter);

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

//unmatched routes middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

//global error handling middleware , fired in catch blocks
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({
    message: error.message,
    status: false,
    statusCode: error.statusCode,
  });
});

module.exports = app;
