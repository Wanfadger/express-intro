const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/globalError`);
const ApiFeature = require('./../utils/apiFeature');

exports.getAllUsers = async (req, res) => {
  try {
    //EXCUTE QUERY
    const apiFeature = new ApiFeature(User.find(), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .paginate();
    const users = await apiFeature.query;

    res.status(200).json({
      status: true,
      message: 'success Users',
      count: users.length,
      data: { users },
    });
  } catch (error) {
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
  }
};

exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.pathUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'Not yet defined',
    status: false,
  });
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) CREATE ERROR IF USER POSTS PASSWORD DATA

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updated. Please use /updateMyPassword ',
          400
        )
      );
    }

    // 2) FILTERED UNWANTED FIELDS THAT ARE NOT ALLOWED TO BE UPDATED
    const filteredBody = filteredFieldsObject(req, 'name', 'email');

    // 2) UPDATE DATA
    // since we not dealing with sensitive data
    const user = await User.findByIdAndUpdate(
      req.currentUser.id,
      { ...filteredBody },
      { new: true, runValidators: true }
    ).select('-__v'); //({ email: req.currentUser.email });
    console.log(user);

    return res.status(201).json({
      message: 'success',
      user,
      status: true,
    });
  } catch (error) {
        console.error(`ERROR ${error.message}`);
        return next(new AppError(`${error.message}`, error.statusCode));
  }
};


const filteredFieldsObject = (req, ...allowedFields) => {
  let reqBody = { ...req.body }
  let filteredObj = {}

  Object.keys(reqBody).forEach(obj => {
    if (allowedFields.includes(obj)) {
      filteredObj[obj] = reqBody[obj]
    }
  })
  return filteredObj
}


exports.deleteMe = async (req , res , next) => {
  try {
    // GET LOGGED USER
    // SET ACTIVE TO FALSE
    const user = await User.findByIdAndUpdate(req.currentUser.id, {
      active: false,
    });
    if (!user) {
      return next(new AppError(`Please Login Again`, 404));
    }

    // RETURN RESPONSE

    return res.status(204).json({
      message: 'successfully deleted',
      status: true,
    });
  } catch (error) {
      console.error(`ERROR ${error.message}`);
      return next(new AppError(`${error.message}`, error.statusCode));
    }
}