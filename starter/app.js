const express = require('express');
const morgan = require("morgan")
const { json } = require('express');

const tourRouter = require(`./routes/tour-router`);
const userRouter = require(`./routes/user-router`);

const app = express();



//////////////////MIDDLE WARES
app.use(express.json());
app.use(morgan("dev"))
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.use((req, res, next) => {
//     console.log("Hello From The middleware")
//     next()
// })

// app.use((req, res, next) => {
//    req.company = "Planet Systems Limited"
//   next();
// });




/////////////ROUTE HANDLERS



// //get
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// /////////////////////////[post]
// app.post('/api/v1/tours', createTour);
// ///////////patch
// app.patch('/api/v1/tours/:id', pathTour);
// ///////////delete
// app.delete('/api/v1/tours/:id', deleteTour);




module.exports = app



