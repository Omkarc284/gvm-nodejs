const mongoose = require('mongoose');

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


module.exports = user;