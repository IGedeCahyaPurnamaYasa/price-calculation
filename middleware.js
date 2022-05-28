/**
 * MODEL
 */
//  const Campground = require('./models/campground');
//  const Review = require('./models/review');
const Product = require('./models/product');
const CostType = require('./models/cost_type');


/**
 * UTILS
 */
const ExpressError = require('./utils/expressError');


/**
 * SCHEMA
 */
 const { productSchema, costTypeSchema, rootIngridientSchema} = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
     if(!req.isAuthenticated()){
         // store the url they are requesting
         req.session.returnTo = req.originalUrl;
         req.flash('error', 'You must be signed in');
         return res.redirect('/login');
     }
     next();
}


module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.validateRootIngridient = (req, res, next) => {
    const { error } = rootIngridientSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.validateProductPartial = (req, res, next) => {
    let product = req.body.product ?? null;
    const { error } = productSchema.validate({product});
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.validateCostType = (req, res, next) => {

    const { error } = costTypeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

 
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if(product){
        if(!product.owner.equals(req.user._id)){
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/products/${id}`);
        }
    }

    const cost_type = await CostType.findById(id);
    if(cost_type){
        if(!cost_type.owner.equals(req.user._id)){
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/cost-type/${id}`);
        }
    }
    
    next();
}
