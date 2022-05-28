const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true} };

const RootIngridientSchema = new Schema({
    name : {
        type: String,
        required: true
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

const RootIngridient = mongoose.model('RootIngridient', RootIngridientSchema);

module.exports = RootIngridient