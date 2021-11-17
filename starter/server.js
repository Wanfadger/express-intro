
const mongoose = require('mongoose');
const app = require("./app")
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


///tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: ['true', 'A tour must have a name'],
  },
  price: {
    type: Number,
    required: ['true', 'A tour must have price'],
  },
  rating: {
    type: Number,
    default:4.5
  },
});


const Tour = mongoose.model("Tour", tourSchema)
const testTour = new Tour({
  name: 'The Parker Camper',
  price: 490,
});

testTour
  .save()
  .then((data) => console.log(data))
  .catch((error) => console.log('EROR ' + error.message));




let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});