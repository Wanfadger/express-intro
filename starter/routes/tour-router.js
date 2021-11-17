
const express = require("express")
const app = require("../app");

const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tour-controller`)


router.route('/').get(tourController.getAllTours)
    .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .put(tourController.updateTour);

module.exports = router