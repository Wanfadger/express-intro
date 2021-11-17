const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
// const { json } = require('express');

//setting env variables
dotenv.config({
  path: `${__dirname}/config.env`,
});

//DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE_URL_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    // console.log(conn);
    console.log('Db Connection Successful');
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

if(process.env.NODE_ENV === "development")  app.use(morgan('dev'));

app.use(express.json());
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
