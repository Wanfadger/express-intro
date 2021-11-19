const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/globalError`);
const sendEmail = require(`${__dirname}/../utils/email`);
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//wrapped a callback into a closure , therefore has access to roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      console.log(roles);
      //forbidden
      return next(
        new AppError(`You Dont have permission to perform this action`, 403)
      );
    }
    next();
  };
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    const token = signToken(newUser._id);

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(password);

    //check if emaill and password exists
    if (!email || !password) {
      return next(new AppError("'Please provide email and password'", 400));
    }

    //check if password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.validatePassword(password, user.password))) {
      return next(new AppError('Ivalid Email or Password', 401));
    }

    // if everything is okay , send authorization token
    const token = signToken(user._id);

    return res.status(200).json({
      status: 'success',
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

    req.currentUser = currentUser;

    next();
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return next(
      new AppError(`ERROR: ${error.message}! , please login again`, 401)
    );
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Get User based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError(
          `Theres no User with tha email ${req.params.email} Address `,
          404
        )
      );
    }

    // Generate random reset token
    const resetToken = await user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false }); //save again user while updateing reset data

    try {
      // Send it to Users email
      const resetPasswordUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
      console.log(`reset Url ${resetPasswordUrl}`);
      console.log(`reset Url ${user.email}`);

      await sendEmail({
        email: user.email,
        subject: 'Your Reset Password Token (Valid for 10 minutes)',
        body: `
      <div>
      Forgot your password? Submit PATCH request with your new password and passwordConfirm to: <b>
      <a href="${resetPasswordUrl}">resetPassword</a>

      <p>
      <strong>
      If you didn't forget your password. please ignore this email! 
      </strong>
      </p>
      </div>
      `,
      });

      //response
      return res.status(200).json({
        message: `link sent to ${user.email} and expires in 10 minutes`,
      });
    } catch (error) {
      //reset links and timer
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpire = undefined;

      await user.save({ validateBeforeSave: false });

      console.log('Mail Error ' + error.message);
      return next(
        new AppError(
          'Something Went Wrong . while sending email. \n Please try again'
        )
      );
    }
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return next(new AppError(`${error.message}`, error.statusCode));
  }
};

exports.forgotReset = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpire: { $gt: Date.now() },
    });

    // 2) if token has not expired, there is user , set new password
    if (!user) {
      return next(
        new AppError(`Token is invalid or has Expired, Try Again `, 400)
      );
    }

    // 3) update user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;

    await user.save();

    // 3) Log the user in , send jwt
    const token = signToken(user._id);
    return res.status(200).json({
      status: 'success',
      mesage: 'Password successfully resetted',
      token,
    });
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return next(new AppError(`${error.message}`, error.statusCode));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //old password is required

    // 1) GET USER FROM COLLECTION
    console.log(req.currentUser);

    const user = await User.findOne({ email: req.currentUser.email}).select("+password");
    if (!user) {
      return next(new AppError(`UnAuthorised User please login`, 403));
    }
 

    // 2) CHECK IF PASSWORD IS CORRECT
    if (!(await user.validatePassword(req.body.password, user.password))) {
      return next(new AppError(`Invalid Password`, 403));
    }
      
    // 3) IF , TRUE UPDATE PASSWORD
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPassword;
    await user.save();

    // 4) LOGIN USER , SEND TOKEN
    // if everything is okay , send authorization token
    const token = signToken(user._id);

    return res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    console.error(`ERROR ${error.message}`);
    return next(new AppError(`${error.message}`, error.statusCode));
  }
};
