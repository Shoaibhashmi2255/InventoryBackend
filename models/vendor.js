const mongoose = require ('mongoose');

const vendorSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },

    isWorking: {
        type: Boolean,
        default: false,
    },
    vendorType: {
        type: String,
        required: true
    }
});

exports.Vendor = mongoose.model('Vendor', vendorSchema);