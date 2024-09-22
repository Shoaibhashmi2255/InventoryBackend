const mongoose = require('mongoose');


const departmentSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: false
    }
});

departmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

departmentSchema.set('toJSON', {
    virtuals: true,
});

exports.Department = mongoose.model('Department', departmentSchema);