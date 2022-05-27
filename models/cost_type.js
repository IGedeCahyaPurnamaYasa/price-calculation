const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true} };

const CostTypeSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['biaya', 'keuntungan'],
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

const CostType = mongoose.model('CostType', CostTypeSchema);

module.exports = CostType