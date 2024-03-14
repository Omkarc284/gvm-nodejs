const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { type: String, required: true},
    role: { type: String, required: true},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});
const user = mongoose.model('users', userSchema);


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}


userSchema.pre('save', async function (next){
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 12)
    }
    next()
})

module.exports = user;