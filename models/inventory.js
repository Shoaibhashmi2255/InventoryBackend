const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    marketPrice: { type: Number },
    scrapPrice: { type: Number },
    remainingQty: { type: Number, default: 0 },  // Remaining quantity in inventory
    totalIssued: { type: Number, default: 0 }, 
});

exports.Inventory = mongoose.model('Inventory', inventorySchema);