
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




let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});