
const Cost = require('../models/cost');

module.exports.data = async (req, res) => {
    let { id } = req.params;

    let costs = await Cost.find({product_id: id})
        .populate('cost_type_id');

    costs = JSON.parse(JSON.stringify(costs));
    
    // for(let i = 0 ; i < costs.length; i++){
    //     costs[i].name = costs[i].cost_type_id.name;
    // }

    res.send({data: costs});
}