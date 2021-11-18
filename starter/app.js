const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const AppError = require(`${__dirname}/utils/globalError`)

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
//////////////////MIDDLE WARES

//overview.html middleware

app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//unmatched routes middleware
app.all('*', (req, res, next) => {
  // res
  //   .status(404)
  //   .json({
  //     message: `Can't find ${req.originalUrl} on the server`,
  //     status: false,
  //   });
  // const err = new Error();
  // err.status = false
  // err.statusCode = 404
  
  next(new AppError(`Can't find ${req.originalUrl} on the servert`, 404));
});

//global error handling middleware , fired in catch blocks
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500
    res.status(404).json({
      message: error.message,
      status: false,
      statusCode: error.statusCode
    });
})

module.exports = app;
