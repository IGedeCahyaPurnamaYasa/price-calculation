const Product = require('../models/product');
const Ingridient = require('../models/ingridient');
const Cost = require('../models/cost');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports.index = async (req, res) => {
    const products = await Product.find({});
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
        .populate('ingridients')
        .populate('costs');

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

    if(!product){
        req.flash('error', 'Cannnot find that product');
        return res.redirect('/product');
    }
    res.render('product/edit', { product: product });
}

module.exports.update = async (req, res) => {

    console.log(req.body);
    const { id } = req.params;
    const product  = await Product.findByIdAndUpdate(id, {...req.body.product});
    // const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    
    // product.images.push(...imgs);
    await product.save();

    if(req.body.ingridient) {
        saveIngridient(req, res)
    }
    if(req.body.cost) {
        saveCost(req, res)
    }

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


const saveIngridient = async (req, res) => {
    const { id } = req.params;
    let ingridients = req.body.ingridient
    console.log('ingridients: ', ingridients);

    await Ingridient.deleteMany({product_id: id})
    const product = await Product.findOne({_id: id});
    product.ingridients = [];

    if(Array.isArray(ingridients.name)){
        for(let i= 0 ; i < ingridients.name.length; i++){
            let temp = {
                product_id: id,
                name: ingridients.name[i],
                qty: ingridients.qty[i],
                unit: ingridients.unit[i],
                price: ingridients.price[i],
                total: ingridients.total[i]
            }
            // console.log('temp: ', temp);
    
            const ingrid = new Ingridient(temp);
            await ingrid.save();

            product.ingridients.push(ingrid);
        }
    }
    else{
        let temp = {
            product_id: id,
            name: ingridients.name,
            qty: ingridients.qty,
            unit: ingridients.unit,
            price: ingridients.price,
            total: ingridients.total
        }
        console.log('temp: ', temp);

        const ingrid = new Ingridient(temp);
        await ingrid.save();

        product.ingridients.push(ingrid);
    }

    await product.save();
}

const saveCost = async (req, res) => {
    const { id } = req.params;
    let costs = req.body.cost

    await Ingridient.deleteMany({product_id: id})
    const product = await Product.findOne({_id: id});
    product.costs = [];

    if(Array.isArray(costs.name)){
        for(let i= 0 ; i < costs.name.length; i++){
            let temp = {
                name: costs.name[i],
                name: costs.type[i],
                name: costs.percentage[i]
            }
    
            const cost = new Cost(temp);
            await cost.save();

            product.costs.push(cost);
        }
    }
    else{
        let temp = {
            name: costs.name[i],
            name: costs.type[i],
            name: costs.percentage[i]
        }

        const cost = new Cost(temp);
        await cost.save();

        product.costs.push(cost);
    }

    await product.save();
}