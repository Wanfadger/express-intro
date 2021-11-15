
const express = require("express")
const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tour-controller`)


//param middleware , only available to this router
router.param('id', tourController.CHECKID);



router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).delete(tourController.deleteTour).patch(tourController.pathTour);

module.exports = router