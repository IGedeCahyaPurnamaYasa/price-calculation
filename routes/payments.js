const express = require('express');

const router = express.Router()

/**
 * UTILS
 */
 const catchAsync = require('../utils/catchAsync');

 
/**
 * CONTROLLERS
 */
const paymentController = require('../controllers/payments');


/**
 * MIDDLEWARE
 */
 const { isLoggedIn, isOwner, validatePayment } = require('../middleware');

/**
 * METHOD
 */
router.route('/')
    .get(isLoggedIn, catchAsync(paymentController.index))
    .post(isLoggedIn, validatePayment, catchAsync(paymentController.store));

router.get('/new', isLoggedIn, paymentController.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(paymentController.show))
    .put(isLoggedIn, isOwner, catchAsync(paymentController.update))
    .delete(isLoggedIn, isOwner, catchAsync(paymentController.delete));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(paymentController.renderEditForm));

module.exports = router;