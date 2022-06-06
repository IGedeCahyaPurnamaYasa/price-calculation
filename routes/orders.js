const express = require('express');
const multer = require('multer');

const router = express.Router()

/**
 * UTILS
 */
 const catchAsync = require('../utils/catchAsync');

 
/**
 * CONTROLLERS
 */
const orderController = require('../controllers/orders');


/**
 * MIDDLEWARE
 */
 const { isLoggedIn, isOwner, validateOrder } = require('../middleware');

/**
 * METHOD
 */
router.route('/')
    .get(isLoggedIn, catchAsync(orderController.index))
    .post(isLoggedIn, validateOrder, catchAsync(orderController.store));
    
router.get('/new', isLoggedIn, orderController.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(orderController.show))
    .put(isLoggedIn, isOwner, catchAsync(orderController.update))
    .delete(isLoggedIn, isOwner, catchAsync(orderController.delete));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(orderController.renderEditForm));

module.exports = router;