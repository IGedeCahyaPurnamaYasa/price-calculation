const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true} };

const OrderDetailSchema = new Schema({
    order_id : {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product_id : {
        type: Schema.Types.ObjectId,
        ref: 'Product',
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
    total: {
        type: Number,
        required: true
    }
}, opts)

const OrderDetail = mongoose.model('OrderDetail', OrderDetailSchema);

module.exports = OrderDetail