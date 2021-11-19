const jwt = require('jsonwebtoken');
const {promisify} = require("util")
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/globalError`);


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signup = async (req, res , next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });


    const token = signToken(newUser._id)

    return res.status(201).json({
      message: 'success',
      token,
      data: { user: newUser },
      status: true,
    });
  } catch (error) {
    return next(
      new AppError(`ERROR: ${error.message}! , please login again`, 400)
    );
  }
};

exports.login = async (req, res , next) => {
  try {
    const { email, password } = req.body;
    console.log(password)

    //check if emaill and password exists
    if (!email || !password) {
     return next(new AppError("'Please provide email and password'" , 400));
    }

    //check if password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.validatePassword(password, user.password))) {
      return next(new AppError('Ivalid Email or Password', 401));
    }

    // if everything is okay , send authorization token
    const token = signToken(user._id);

    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return next(new AppError('Unknown Error', 500));
  }
};


exports.protect = async (req, res, next) => {
  try {
    // get the token check if exits
    const { authorization } = req.headers;

    let token;

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }

    //validate the token
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }

    //if verification is successfully , check if user still exists
    const decodedPayload = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ); //promisified and called immediately
    console.log(decodedPayload);

    //check if user exits
    const currentUser = await User.findById(decodedPayload.id);
    if (!currentUser) {
      return next(
        new AppError('User belonging to token, nolonger exists', 401)
      );
    }

    //check if user changed password after jwt was changed
    //add passchange property 

    ///GRANT ACCRSS TO CURRENT USER

    req.currentUser = currentUser

    next();
  } catch (error) {
        console.error(`ERROR ${error.message}`);
        return next(new AppError(`ERROR: ${error.message}! , please login again`, 401));
  }
};
