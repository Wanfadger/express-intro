const Tour = require('./../models/tourModel');
class ApiFeature {
  constructor(query, requestQuery) {
    this.query = query;
    this.requestQuery = requestQuery;
  }

  filter() {
    let queryObject = { ...this.requestQuery }; //Its better to manipulate a reference than real object , thus distructing the query object
    const excludedFields = ['limit', 'page', 'sort', 'field']; //these are not database fiels so exclude them
    // console.log(queryObject);
    //removing excluded query parameter
    excludedFields.forEach((el) => delete queryObject[el]); //delete from the object

    //1B) Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      // query.sort('price ratingAverage')
      let sortBy = this.requestQuery.sort.split(',').join(' ');
    //   console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fieldLimiting() {
    if (this.requestQuery.fields) {
      // query.select(price ratingAverage duration)
      let fields = this.requestQuery.fields.split(',').join(' ');
    //   console.log(fields);
      this.query = this.query.select(fields); //include only specified fields
    } else {
      this.query = this.query.select('-__v '); //to exclude that field
    }
    return this;
  }

  paginate() {
    ///4) Pagination
    if (this.requestQuery.page && this.requestQuery.limit) {
      // const numTours = await Tour.countDocuments();

      const page = Number(this.requestQuery.page);
      const limit = Number(this.requestQuery.limit);
      const skip = (page - 1) * limit;

      //if page is not avaoilale
      // if (skip >= numTours) {
      //   throw new Error('Page not available');
      // }

      this.query = this.query.skip(skip).limit(limit);
    } else {
      this.query = this.query.skip(0).limit(100);
    }
    //page=2&limit=10 , page1 1-10 , page2 11-20 , page3 21-30 , page4 31-40 etc
    //skip (page-1)*limit
    return this;
  }
}

module.exports = ApiFeature;
