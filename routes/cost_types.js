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
const costTypeController = require('../controllers/cost_types');


/**
 * MIDDLEWARE
 */
 const { isLoggedIn, isOwner, validateCostType } = require('../middleware');

/**
 * METHOD
 */
router.route('/')
    .get(isLoggedIn, catchAsync(costTypeController.index))
    .post(isLoggedIn, validateCostType, catchAsync(costTypeController.store));


router.route('/data')
    .get(isLoggedIn, catchAsync(costTypeController.data));

router.get('/new', isLoggedIn, costTypeController.renderNewForm);

module.exports = router;