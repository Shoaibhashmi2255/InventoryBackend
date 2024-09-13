const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:String,
    id:String,
    vendor:String,
    department:String,
    category: String,
    countInStock:String,
    price:Number
})

exports.Product = mongoose.model('Products', productSchema);