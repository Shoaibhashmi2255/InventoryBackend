const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required:false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:false
    },
    dateOrdered: {
        type: Date,
        default: Date.now, 
    },
    quantityIssue:{
        type: Number
    }
});


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


exports.Order = mongoose.model("Order", orderSchema);














/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "department": "5fd51bc7e39ba856244a3b44",
    "branch": "",
    "status": ""
}

 */