const mongoose = require('mongoose');
const Cost = require('./cost')
const Ingridient = require('./ingridient')


const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true} };

const ProductSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        default: 0
    },
    images: [ImageSchema],
    ingridients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Ingridient'
        }
    ],
    costs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cost'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

ProductSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Cost.deleteMany({
            _id: {
                $in: doc.costs
            }
        })

        await Ingridient.deleteMany({
            _id: {
                $in: doc.ingridients
            }
        })
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product