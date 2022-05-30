const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true} };

const IngridientSchema = new Schema({
    product_id :{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    root_ingridient_id: {
        type: Schema.Types.ObjectId,
        ref: 'RootIngridient'
    },
    name : {
        type: String
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, opts)

const Ingridient = mongoose.model('Ingridient', IngridientSchema);

module.exports = Ingridient