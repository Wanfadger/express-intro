const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/globalError`);


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signup = async (req, res) => {
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
    console.log('ERROR ' + error.message);
    return res.status('404').json({
      message: error.message,
      status: false,
    });
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

    if(!user || ! await user.validate(password , user.password)) {return next(new AppError("Ivalid Email or Password", 401));}

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
