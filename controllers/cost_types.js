const CostType = require('../models/cost_type');
const Cost = require('../models/cost');


module.exports.index = async (req, res) => {
    const cost_types = await CostType.find({});
    res.render('cost_type/index', {cost_types});
}

// module.exports.data = async (req, res) => {
//     const product = await Product.find({});
//     res.send(product);
// }

module.exports.renderNewForm = async (req, res) => {
    res.render('cost_type/form');
}

module.exports.store = async(req, res, next) => {
    const cost_type = new CostType(req.body.cost_type);
    cost_type.owner = req.user._id;

    await cost_type.save();

    req.flash('success', 'Successfully add new cost type');
    res.redirect(`/cost-type/${cost_type._id}`);
}


module.exports.show = async (req, res) => {
    const { id } = req.params;

    const cost_type = await CostType.findById(id);

    if(!cost_type){
        req.flash('error', 'Cannnot find that cost_type');
        return res.redirect('/cost_type');
    }
    res.render('cost_type/show', { cost_type: cost_type });
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const cost_type = await CostType.findById(id);

    if(!cost_type){
        req.flash('error', 'Cannnot find that cost_type');
        return res.redirect('/cost_type');
    }

    res.render('cost_type/form', { cost_type: cost_type });
}


module.exports.update = async (req, res) => {
    const { id } = req.params;
    const cost_type  = await CostType.findByIdAndUpdate(id, {...req.body.cost_type});

    await cost_type.save();
    
    req.flash('success', 'Successfully updated cost type!');
    res.redirect(`/cost-type`);
}


module.exports.delete = async (req, res) => {
    const { id } = req.params;

    const cost = Cost.find({cost_type_id: id});

    if(cost){
        req.flash('error', 'Cannot delete this cost type, already used on cost');
        res.redirect('product');
    }
    await Product.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted product');
    res.redirect('/product');
}
