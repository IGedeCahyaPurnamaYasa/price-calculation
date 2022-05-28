const express = require('express');

const router = express.Router()

/**
 * UTILS
 */
 const catchAsync = require('../utils/catchAsync');

 
/**
 * CONTROLLERS
 */
const rootIngridientController = require('../controllers/root_ingridients');


/**
 * MIDDLEWARE
 */
 const { isLoggedIn, isOwner, validateRootIngridient } = require('../middleware');

/**
 * METHOD
 */
router.route('/')
    .get(isLoggedIn, catchAsync(rootIngridientController.index))
    .post(isLoggedIn, validateRootIngridient, catchAsync(rootIngridientController.store));

router.get('/new', isLoggedIn, rootIngridientController.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(rootIngridientController.show))
    .put(isLoggedIn, isOwner, catchAsync(rootIngridientController.update))
    .delete(isLoggedIn, isOwner, catchAsync(rootIngridientController.delete));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(rootIngridientController.renderEditForm));

module.exports = router;