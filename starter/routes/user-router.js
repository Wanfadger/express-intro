
const express = require('express');
const router = express.Router();
const userController = require(`${__dirname}/../controllers/user-controller`)



router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getAllUsers).delete(userController.deleteUser).patch(userController.pathUser);


module.exports = router