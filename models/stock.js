const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    LastMonthInventory: { type: Number, required: true },  // Stock at start of month
    TotalStock: { type: Number, required: true }, 
    stockIssued: { type: Number, default: 0 },       // Stock issued this month
    stockRemaining: { type: Number, default: 0 },    // Remaining stock at end of month
    month: { type: Number, required: true },         // Current month (1-12)
    year: { type: Number, required: true },          // Current year (e.g., 2023)
    dateCreated: { type: Date, default: Date.now }
});


stockSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

stockSchema.set('toJSON', {
    virtuals: true,
});

exports.stock = mongoose.model('Stock', stockSchema);



// {
//     "name":"stationary",
//     "description":"book",
//     "vendor":"Ali",
//     "department":"Admin",
//     "category":"stationary",
//     "quantity":"2",
//     "price":"30",
//     "scrapPrice":"1",
//     "marketPtice":"30"

// }