
const express = require('express');
const router = express.Router();
const userController = require(`${__dirname}/../controllers/user-controller`)
const authController = require(`${__dirname}/../controllers/authController`);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.forgotReset);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);


router.patch('/updateMe', authController.protect, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);



router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getAllUsers).delete(userController.deleteUser).patch(userController.pathUser);


module.exports = router