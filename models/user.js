const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    name: {
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
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    department: {
        type: String,
        default: ''
    },
    branch: {
        type: String,
        default: ''
    }
});

userSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals : true
});


exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;