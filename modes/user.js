const mongoose =require('mongoose');
const { minimatch } = require('prettier');

const UserSchema =  mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    passwordHash: {
        type:String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    
});

exports.User = mongoose.model('User', UserSchema);