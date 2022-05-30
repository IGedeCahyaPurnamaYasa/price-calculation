const Product = require('../models/product');
const CostType = require('../models/cost_type');
const Ingridient = require('../models/ingridient');
const Cost = require('../models/cost');
const mongoose = require('mongoose');
const RootIngridient = require('../models/root_ingridient');
const ObjectId = mongoose.Types.ObjectId;

module.exports.index = async (req, res) => {
    
    const products = await Product.find({})
        .populate('ingridients')
        .populate('costs');
        // console.log(products);
        // console.log(products[0]);
    res.render('product/index', {products});
}

module.exports.data = async (req, res) => {
    const product = await Product.find({});
    res.send(product);
}

module.exports.renderNewForm = async (req, res) => {
    res.render('product/new');
}

module.exports.store = async(req, res, next) => {
    const product = new Product(req.body.product);

    product.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    product.owner = req.user._id;

    await product.save();

    req.flash('success', 'Successfully add new product');
    res.redirect(`/product/${product._id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate({
            path: 'ingridients',
            populate: {
                path: 'root_ingridient_id'
            }
        })
        .populate({
            path: 'costs',
            populate: {
                path: 'cost_type_id'
            }
        });

    if(!product){
        req.flash('error', 'Cannnot find that product');
        return res.redirect('/product');
    }
    res.render('product/show', { product: product });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('ingridients')
        .populate('costs');

    const cost_types = await CostType.find({owner : req.user._id});
    const ingridients = await RootIngridient.find({owner : req.user._id});

    if(!product){
        req.flash('error', 'Cannnot find that product');
        return res.redirect('/product');
    }
    res.render('product/edit', { product, cost_types, ingridients });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const product  = await Product.findByIdAndUpdate(id, {...req.body.product});
    // const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    
    // product.images.push(...imgs);
    await product.save();

    await saveIngridient(req, product)
    await saveCost(req, product)

    // if(req.body.deleteImages){
    //     for(let filename of req.body.deleteImages){
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await product.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        
    // }
    
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/product/${product._id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted product');
    res.redirect('/product');
}


const saveIngridient = async (req, product) => {
    const { id } = req.params;
    let ingridients = req.body.ingridient

    await Ingridient.deleteMany({product_id: id})
    product.ingridients = [];

    if(ingridients){
        if(Array.isArray(ingridients.total)){
            for(let i= 0 ; i < ingridients.total.length; i++){
                console.log(ingridients);
                if(ingridients.total[i] > 0){
                    let temp = {
                        product_id: id,
                        root_ingridient_id: ingridients.root_ingridient_id[i],
                        // name: ingridients.name ? ingridients.name[i] : '',
                        qty: ingridients.qty[i],
                        unit: ingridients.unit[i],
                        price: ingridients.price[i],
                        total: ingridients.total[i]
                    }
            
                    const ingrid = new Ingridient(temp);
                    await ingrid.save();
        
                    product.ingridients.push(ingrid);
                }
            }
        }
        else{
            if(ingridients.total > 0){
                let temp = {
                    product_id: id,
                    root_ingridient_id: ingridients.root_ingridient_id,
                    // name: ingridients.name,
                    qty: ingridients.qty,
                    unit: ingridients.unit,
                    price: ingridients.price,
                    total: ingridients.total
                }
        
                const ingrid = new Ingridient(temp);
                await ingrid.save();
        
                product.ingridients.push(ingrid);
            }
        }
    }

    await product.save();
}

const saveCost = async (req, product) => {
    const { id } = req.params;
    let costs = req.body.cost

    await Cost.deleteMany({product_id: id})
    product.costs = [];

    if(costs) {
        if(Array.isArray(costs.cost_type_id)){
            for(let i= 0 ; i < costs.cost_type_id.length; i++){
    
                if(costs.percentage[i] !== ''){
                    let temp = {
                        product_id: id,
                        cost_type_id: costs.cost_type_id[i],
                        percentage: costs.percentage[i]
                    }
            
                    const cost = new Cost(temp);
                    await cost.save();
        
                    product.costs.push(cost);
                }
            }
        }
        else{
            if(costs.percentage !== ''){
                let temp = {
                    product_id: id,
                    cost_type_id: costs.cost_type_id,
                    percentage: costs.percentage
                }
                
                const cost = new Cost(temp);
                await cost.save();
        
                product.costs.push(cost);
            }
        }
    }

    await product.save();
}