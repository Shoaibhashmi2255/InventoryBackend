const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    marketPtice: {
        type: Number,
        default: 0
    },
    scrapPrice: {
        type: Number,
        default: 0
    },
    inlineFormulas: {
        type: String
    },
    dateCreated: {
        type:Date,
        default: Date.now
    }
})

exports.Product = mongoose.model('Products', productSchema);