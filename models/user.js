const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

/**
 * this line will add on to our schema
 * a username, password
 * and make sure the username was unique
 */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);