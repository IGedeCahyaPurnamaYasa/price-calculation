const CostType = require('../models/cost_type');


module.exports.index = async (req, res) => {
    const cost_types = await CostType.find({});
    res.render('cost_type/index', {cost_types});
}

// module.exports.data = async (req, res) => {
//     const product = await Product.find({});
//     res.send(product);
// }

module.exports.renderNewForm = async (req, res) => {
    res.render('cost_type/new');
}

module.exports.store = async(req, res, next) => {
    const cost_type = new CostType(req.body.cost_type);
    cost_type.owner = req.user._id;

    await cost_type.save();

    req.flash('success', 'Successfully add new cost type');
    res.redirect(`/product/${cost_type._id}`);
}