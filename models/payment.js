const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true} };

const PaymentSchema = new Schema({
    order_id : {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    payment_code: {
        type: String,
        required: true
    },
    payment_category : {
        type: String,
        enum: ['DP', 'Installment', 'Paid Off'],
        required: true
    },
    payment_value: {
        type: Number,
        required: true
    },
    payment_date : {
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment