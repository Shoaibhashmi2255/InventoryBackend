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

exports.Department = mongoose.model('Department', departmentSchema);