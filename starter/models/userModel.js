const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: ['true', 'Please tel us a name'],
  },
  email: {
    type: String,
    required: ['true', 'Please tel us a email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: `Please provide a valid email {VALUE}`,
    },
  },
  password: {
    type: String,
    select: false,
    required: ['true', 'Password is required'],
    minlenght: 8,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: ['true', 'Password is required'],
    minlenght: 8,
    validate: {
      //only works for SAVE
      validator: function (val) {
        return val === this.password;
      },
      message: `Passwords donot match`,
    },
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetTokenExpire: {
    type: Date,
    select: false,
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  //only runs if password is modified , cases of updating
  if (!this.isModified('password')) return next();

  // Hash password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //DELETE CONFIRM PASSWORD
  this.passwordConfirm = undefined;
  next();
});

//validate password on login
userSchema.methods.validatePassword = async function (
  password,
  hashedPassword
) {
  return bcrypt.compare(password, hashedPassword);
};

//Generate password reset token
userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetTokenExpire = Date.now() + (10 * 60 * 1000)  //[10 minutes to seconds and then milliseconds]

 // console.log({ resetToken }  , this.passwordResetToken  , this.passwordResetTokenExpire )
  
  return resetToken;
};

const user = mongoose.model('user', userSchema);

module.exports = user;
