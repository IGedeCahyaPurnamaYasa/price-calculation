
const Ingridient = require('../models/ingridient');

module.exports.data = async (req, res) => {
    let { id } = req.params;

    let ingridients = await Ingridient.find({product_id: id})
        .populate('root_ingridient_id');

    ingridients = JSON.parse(JSON.stringify(ingridients));
    
    for(let i = 0 ; i < ingridients.length; i++){
        ingridients[i].name = ingridients[i].name ?? ingridients[i].root_ingridient_id.name
    }

    res.send({data: ingridients});
}