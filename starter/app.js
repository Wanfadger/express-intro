const fs = require('fs');
const express = require('express');
const { json } = require('express');

const app = express();

//middlewares
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);



const getAllTours = (req , res) => {
   res.status(200).json({
     message: 'success',
     count: tours.length,
     data: { tours },
     status: true,
   });
}

const createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1]._id + '1';
  const newTour = Object.assign({ _id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (error, data) => {
      if (error) console.log('Error ' + error.message);
      res.status(201).json({
        message: 'success',
        data: { trour: newTour },
        status: true,
      });
    }
  );
};

const getTour = (req, res) => {
      console.log(req.params);
      // console.log(req.query)
      const tour = tours.find((t) => t._id === req.params.id);
      if (!tour) {
        return res.status(404).json({
          message: 'Tour not found',
          data: { tour },
          status: false,
        });
      }
      res.status(200).json({
        message: 'success',
        data: { tour },
        status: true,
      });
};

const pathTour = (req, res) => {
      console.log(req.params);

      res.status(200).end(`Patching ${req.params.id}`);
};

const deleteTour = (req, res) => {
      console.log(req.params);
      res.status(200).end(`Deleting ${req.params.id}`);
};

//get
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
/////////////////////////[post]
app.post('/api/v1/tours', createTour);
///////////patch
app.patch('/api/v1/tours/:id', pathTour);
///////////delete
app.delete('/api/v1/tours/:id', deleteTour);



let port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});



