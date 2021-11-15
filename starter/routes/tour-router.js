
const express = require("express")
const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tour-controller`)



router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).delete(tourController.deleteTour).patch(tourController.pathTour);

module.exports = router