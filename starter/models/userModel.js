const mongoose = require('mongoose');
var validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: ['true', 'Please tel us a name'],
    },
    email: {
      type: String,
      required: ['true', 'Please tel us a email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail(), 'please provide your email'],
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
    },
    photo: {
      type: String,
    },
  },

);

const user = mongoose.model('user', userSchema);

module.exports = user;
