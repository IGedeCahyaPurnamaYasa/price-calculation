const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router()

/**
 * UTILS
 */
 const catchAsync = require('../utils/catchAsync');

 
/**
 * CONTROLLERS
 */
const productController = require('../controllers/products');
const ingridientController = require('../controllers/ingridients');
const costController = require('../controllers/costs');


/**
 * MIDDLEWARE
 */
 const { isLoggedIn, isOwner, validateProduct, validateProductPartial } = require('../middleware');
const { render } = require('express/lib/response');

/**
 * METHOD
 */
router.route('/')
    .get(isLoggedIn, catchAsync(productController.index))
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(productController.store));


router.route('/data')
    .get(isLoggedIn, catchAsync(productController.data));

router.get('/new', isLoggedIn, productController.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, catchAsync(productController.show))
    .put(isLoggedIn, isOwner, upload.array('image'), validateProductPartial, catchAsync(productController.update))
    .delete(isLoggedIn, isOwner, catchAsync(productController.delete));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(productController.renderEditForm));


router.get('/:id/ingridients', isLoggedIn, ingridientController.data);
router.get('/:id/costs', isLoggedIn, costController.data);

module.exports = router;