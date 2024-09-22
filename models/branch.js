const mongoose = require('mongoose');


const branchSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    address: {
        type: String,
        required : true
    },
});

branchSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

branchSchema.set('toJSON', {
    virtuals: true,
});


exports.Branch = mongoose.model('Branch', branchSchema);