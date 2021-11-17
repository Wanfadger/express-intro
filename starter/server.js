
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
  raring: {
    type: Number,
    default:4.5
  },
});





let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});