const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
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
  photo: {
    type: String,
  },
});

userSchema.pre('save', async (next) => {
  //only runs if password is modified , cases of updating
  if (!this.isModified('password')) return next()

  // Hash password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  
  //DELETE CONFIRM PASSWORD
  this.passwordConfirm = undefined

})

const user = mongoose.model('user', userSchema);

module.exports = user;
