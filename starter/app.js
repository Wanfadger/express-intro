const fs = require('fs');
const express = require('express');
const { json } = require('express');

const app = express();

//middlewares
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    message: 'success',
    count: tours.length,
    data: { tours },
    status: true,
  });
  //.send("Hello World from server side")
});

/////////////////////////[post]
app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1] + 1;
  const newTour = Object.assign({ id: newId }, req.body);

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
});

let port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
