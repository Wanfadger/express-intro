const mongoose = require('mongoose');
const slugify = require('slugify');

//Define a schema
var Schema = mongoose.Schema;

///tour schema
const tourSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: ['true', 'A tour must have a name'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'difficulty is either: easy , medium or difficulty',
      },
    },
    priceDiscount: {
      type: String,
      validate: {
        validator: function (val) {
          //This only poinst to current document on new document creation
          return val < this.price;
        },
        message: `Discount ({VALUE}) should be lower than regular value)`,
      },
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
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date], //starts different dates
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; //since we want ot access current schemas property we used this, thus function not short function
});

//DOCUMENT MIDDLEWARE : runs when on save and create and not on Many()
//this points to current document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this);
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log("About to save middleware");
//   next();
// });

// tourSchema.post('save', function (doc , next) {
//   console.log(doc);
//   next();
// });

///////////////////// QUERY MIDDLEWARE
//this points to current query
//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  next();
});

///////////////////// AGGREGATION MIDDLEWARE
//this points to current aggregation object
//tourSchema.pre('find', function (next) {
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
