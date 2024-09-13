const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    department: {
        type: String,
        default: ''
    }

});

exports.User = mongoose.model('User', userSchema);