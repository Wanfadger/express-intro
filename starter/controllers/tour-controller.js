const Tour = require('./../models/tourModel');
const ApiFeature = require('./../utils/apiFeature');
const AppError = require(`${__dirname}/../utils/globalError`);

 var month = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
 ];

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year; //2021-11-17
    const tours = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year - 01 - 01}`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTour: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: "$_id",
          author: 'wanfadger',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTour: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    return res.status(201).json({
      message: 'success',
      data: { tours },
      status: true,
    });
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return res.status('400').json({
      message: error.message,
      status: false,
    });
  }
}

exports.getTourStatistics = async (req, res) => {
  try {
    //stream
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      {
        $match: { avgPrice: { $gt: 900 } },
      },
    ]);
    return res.status(201).json({
      message: 'success',
      data: { stats },
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
     return next(new AppError('Unknown Error', 500));
    // return res.status('404').json({
    //   message: error.message,
    //   status: false,
    // });
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

exports.getTour = async (req, res , next) => {
  try {

     const tour = await Tour.findById(req.params.id);
     if (!tour) {
       return next(new AppError('Tour not found ', 404));
     }

    // const tour = await Tour.findById(req.params.id);
    console.log(tour)
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

exports.updateTour = async (req, res , next) => {
  try {
    const tour = await Tour.findById(req.params.id)

      if (! tour) {
        return next(new AppError('Tour not found ', 404));
      }


    const updatedtour = await Tour.findByIdAndUpdate(tour._id, req.body, {
      new: true,
      runValidators: true,
    }); //returns new updated tour

    res.status(200).json({
      status: true,
      message: 'success',
      data: { tour:updatedtour },
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};

exports.deleteTour = async (req, res , next) => {
  try {
    console.log(req.params)
   const tour = await Tour.findById(req.params.id);
    if (! tour) {
      return next(new AppError('Tour not found ', 404));
    }

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
