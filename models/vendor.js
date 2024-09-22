const mongoose = require ('mongoose');

const vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },

    isWorking: {
        type: Boolean,
        default: false,
    },
    vendorType: {
        type: String,
        required: false
    }
});

exports.Vendor = mongoose.model('Vendor', vendorSchema);