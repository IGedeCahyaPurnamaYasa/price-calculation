const mongoose = require('mongoose');

const OrderDetail = require('./order_detail');
const Payment = require('./payment');

const Schema = mongoose.Schema;


const opts = {toJSON: {virtuals: true} };

const OrderSchema = new Schema({
    order_code : {
        type: String,
        required: true
    },
    total_order: {
        type: Number,
        required: true
    },
    order_for : {
        type: String,
        required: true
    },
    order_address : {
        type: String
    },
    order_date : {
        type: Date,
        required: true
    },
    date_taken : {
        type: Date,
        required: true
    },
    order_category : {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },
    order_details: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderDetail'
        }
    ],
    payments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)


OrderSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await OrderDetail.deleteMany({
            _id: {
                $in: doc.order_details
            }
        })

        await Payment.deleteMany({
            _id: {
                $in: doc.payments
            }
        })
    }
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order