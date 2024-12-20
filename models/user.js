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
    role: { 
        type: String, 
        enum: ['admin', 'semi-admin', 'user'], // Define allowed roles
        default: 'user'                       // Default role for new users
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: false
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: false
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