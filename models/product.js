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

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Products', productSchema);



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