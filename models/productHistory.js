// models/productHistory.js
const mongoose = require('mongoose');

const productHistorySchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    month: {
        type: String, // e.g., "October 2024"
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

const ProductHistory = mongoose.model('ProductHistory', productHistorySchema);
module.exports = ProductHistory;
