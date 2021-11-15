const fs = require('fs');

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8')
);

exports.CHECKID = (req, res, next, val) => {
    console.log("Param Middleware")
    next()
}

exports.getAllTours = (req, res) => {
  console.log(req.company);
  res.status(200).json({
    message: 'success',
    count: tours.length,
    data: { tours },
    status: true,
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1]._id + '1';
  const newTour = Object.assign({ _id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours.json`,
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

exports.getTour = (req, res) => {
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

exports.pathTour = (req, res) => {
  console.log(req.params);

  res.status(200).end(`Patching ${req.params.id}`);
};

exports.deleteTour = (req, res) => {
  console.log(req.params);
  res.status(200).end(`Deleting ${req.params.id}`);
};
