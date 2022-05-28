const RootIngridient = require('../models/root_ingridient');
const Ingridient = require('../models/ingridient');
const { findByIdAndUpdate } = require('../models/root_ingridient');

const title = 'Ingridient';

module.exports.index = async (req, res) => {
    const ingridients = await RootIngridient.find({});
    // const title = 'Ingridient'
    res.render('ingridient/index', {ingridients, title});
}

module.exports.renderNewForm = async (req, res) => {
    res.render('ingridient/form', {title});
}

module.exports.store = async(req, res, next) => {
    const ingridient = new RootIngridient(req.body.ingridient);
    ingridient.owner = req.user._id;

    await ingridient.save();

    req.flash('success', 'Successfully add new ingridient');
    res.redirect(`/ingridient`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    const ingridient = await RootIngridient.findById(id);

    if(!ingridient){
        req.flash('error', 'Cannnot find that ingridient');
        return res.redirect('/ingridient');
    }
    res.render('ingridient/show', { ingridient: ingridient });
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const ingridient = await RootIngridient.findById(id);

    if(!ingridient){
        req.flash('error', 'Cannnot find that ingridient');
        return res.redirect('/ingridient');
    }

    res.render('ingridient/form', { ingridient: ingridient, title});
}


module.exports.update = async (req, res) => {
    const { id } = req.params;
    const ingridient  = await RootIngridient.findByIdAndUpdate(id, {...req.body.ingridient});

    await ingridient.save();
    await re_calculate_ingridient_product(ingridient);

    req.flash('success', 'Successfully updated ingridient!');
    res.redirect(`/ingridient`);
}


module.exports.delete = async (req, res) => {
    const { id } = req.params;

    const ingridient = await Ingridient.find({root_ingridient_id: id});
    console.log(ingridient);
    if(ingridient.length > 0){
        req.flash('error', 'Cannot delete this root ingridient, already used on product');
        res.redirect('/ingridient');
    }

    await RootIngridient.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted ingridient');
    res.redirect('/ingridient');
}

const re_calculate_ingridient_product = async (ingridient) => {
    const product_ingridients = await Ingridient.find({root_ingridient_id: ingridient.id});

    for(let temp of product_ingridients){
        await Ingridient.findByIdAndUpdate(temp._id, {
            price: ingridient.price,
            total: temp.qty * ingridient.price
        });
    }
}