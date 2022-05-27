const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true} };

const CostSchema = new Schema({
    product_id : {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    cost_type_id: {
        type: Schema.Types.ObjectId,
        ref: 'CostType'
    },
    percentage: {
        type: Number,
        default: 0
    }
}, opts)

const Cost = mongoose.model('Cost', CostSchema);

module.exports = Cost