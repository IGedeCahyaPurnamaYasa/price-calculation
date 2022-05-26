const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

/**
 * CONTROLLERS
 */
const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register));

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.login);

router.get('/logout', userController.logout);

module.exports = router