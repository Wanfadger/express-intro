const Tour = require('./../models/tourModel');
const ApiFeature  = require('./../utils/apiFeature')

exports.getAllTours = async (req, res) => {
  try {
    //EXCUTE QUERY
    const apiFeature = new ApiFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .paginate();
    const tours = await apiFeature.query;

    res.status(200).json({
      status: true,
      message: 'success',
      count: tours.length,
      data: { tours },
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    return res.status(201).json({
      message: 'success',
      data: { tour: tour },
      status: true,
    });
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return res.status('400').json({
      message: error.message,
      status: false,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: true,
      message: 'success',
      data: { tour },
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); //returns new updated tour

    res.status(200).json({
      status: true,
      message: 'success',
      data: { tour },
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); //returns new updated tour

    res.status(204).json({
      status: true,
      message: 'success',
      data: null,
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};
