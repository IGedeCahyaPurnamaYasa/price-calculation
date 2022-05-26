const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true} };

const CostTemplateSchema = new Schema({
    template : String
}, opts)

const CostTemplate = mongoose.model('CostTemplate', CostTemplateSchema);

module.exports = CostTemplate