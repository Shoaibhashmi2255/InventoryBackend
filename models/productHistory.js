const mongoose = require('mongoose');

const productHistorySchema = mongoose.Schema({
    name: String,
    description: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    quantity: Number,
    stockIssued: Number,
    stockRemaining: Number,
    price: Number,
    marketPrice: Number,
    scrapPrice: Number,
    inventory: Number,
    totalIssued: Number,
    totalRemaining: Number,
    totalStock: Number,
    resetDate: { type: Date, default: Date.now } // Timestamp for each reset
});

const ProductHistory = mongoose.model('ProductHistory', productHistorySchema);
module.exports = ProductHistory;
