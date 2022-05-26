const mongoose = require('mongoose');

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
        type: Number 
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
    // if(doc){
    //     await 
    // }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product