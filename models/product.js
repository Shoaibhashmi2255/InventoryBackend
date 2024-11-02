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
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    quantity: {    //total stock
        type: Number,
        default: 0
    },
    newQuantityOFProduct: {    
        type: Number,
        default: 0
    },
    stockIssued: { type: Number, default: 0 }, // Stock issued
    stockRemaining: { 
        type: Number, 
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    // marketPrice: {
    //     type: Number,
    //     default: 0
    // },
    // scrapPrice: {
    //     type: Number,
    //     default: 0
    // },
    inlineFormulas: {
        type: String
    },
    dateCreated: {
        type:Date,
        default: Date.now
    },
    inventory: {
        type: Number,
        default: 0
    },
    totalIssued:{
        type:Number,
        default: 0
    },
    // totalRemaining:{
    //     type:Number,
    //     default: 0
    // },
    totalStock:{
        type:Number,
        default: 0
    },
    newQuantityDates: [{ type: Date }], // Array to store dates when new quantities are added
    // Other fields
});

// Pre-save middleware to calculate totalStock and stockRemaining before saving
productSchema.pre('save', function(next) {
    // Recalculate totalStock as inventory + quantity
    this.totalStock = this.inventory + this.quantity;

    // Set stockRemaining to totalStock if stockIssued is zero; otherwise, calculate the difference
    this.stockRemaining = this.stockIssued ? (this.totalStock - this.stockIssued) : this.totalStock;

    next();
});



productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);



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