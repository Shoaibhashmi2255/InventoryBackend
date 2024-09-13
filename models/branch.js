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


exports.Branch = mongoose.model('Branch', branchSchema);