const mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

///tour schema
const tourSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: ['true', 'A tour must have a name'],
  },
  price: {
    type: Number,
    required: ['true', 'A tour must have price'],
  },
  priceDiscount: Number,
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0.0,
  },
  duration: {
    type: Number,
    required: ['true', 'A tour must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: ['true', 'A tour must have max group size'],
  },
  difficulty: {
    type: String,
    required: ['true', 'A tour should have difficulty'],
  },
  summary: {
    type: String,
    trim: true,
    required: ['true', 'Must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    trim: true,
    required: ['true', 'Must have cover images'],
  },
  images: [String], //an array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },
  startDates: [Date], //starts different dates
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
