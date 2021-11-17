const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require(`${__dirname}/../../models/tourModel`);

const dotenv = require('dotenv');

//setting env variables
dotenv.config({
  path: `${__dirname}/config.env`,
});

// DATABASE CONNECTION
mongoose
  .connect('mongodb://localhost:27017/natours-test', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    // console.log(conn);
    console.log('Db Connection Successful');
  });

//READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    console.log(`tours size ${tours.length}`);
    await Tour.create(tours); //drop
    console.log('Successfully loaded');
  } catch (error) {
    console.log('ERROR ' + error.message);
  }
  process.exit();
};

//DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    console.log(`tours size ${tours.length}`);
    await Tour.deleteMany();
    console.log('Successfully deleted');
  } catch (error) {
    console.log('ERROR ' + error.message);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
}
if (process.argv[2] == '--delete') {
  deleteData();
}
console.log(process.argv);
