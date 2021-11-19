
const express = require("express")
const app = require("../app");

const router = express.Router();
const tourController = require(`${__dirname}/../controllers/tour-controller`)
const authController = require(`${__dirname}/../controllers/authController`);


router
  .route('/')
  .get(authController.protect , tourController.getAllTours)
  .post(tourController.createTour);
  
router.get('/stats', tourController.getTourStatistics);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin" , "lead-guide"),
    tourController.deleteTour
  )
  .put(tourController.updateTour);

module.exports = router