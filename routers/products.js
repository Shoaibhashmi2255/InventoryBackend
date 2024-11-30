const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { Vendor } = require('../models/vendor');
const { Department } = require('../models/department');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    let filter = {};

    if (req.query.categories) {
        filter.category = { $in: req.query.categories.split(',') };
    }

    if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: 'i' }; 
    }

    if (req.query.department) {
        filter.department = req.query.departments;
    }

    if (req.query.vendor) {
        filter.vendor = req.query.vendor;
    }

    const product = await Product.find(filter).populate('category department vendor');

    if (!product) {
        res.status(500).send({ success: false, error: err })
    }
    res.status(201).send(product);
});


router.get(`/:id`, async (req, res) => {
    console.log("Product ID received:", req.params.id);
    const product = await Product.findById({
        _id: req.params.id
    }).populate('category department vendor');

    if (!product) {
        res.status(500).send('Product not found');
    }
    res.status(200).send(product);
});


router.post(`/`, async (req, res) => {
    
    const category = await Category.findById(req.body.category);
    if(!category) res.status(400).send('invalid Category');

    const vendor = await Vendor.findById(req.body.vendor);
    if(!vendor) res.status(400).send('invalid vendor');

    // const department = await Department.findById(req.body.department);
    // if(!department) res.status(400).send('invalid department');


    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        vendor: req.body.vendor,
        department: req.body.department,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
        // scrapPrice: req.body.scrapPrice,
        // marketPtice: req.body.marketPrice,
        newQuantityOFProduct: req.body.newQuantityOFProduct,
        inlineFormulas: req.body.inlineFormulas,
        dateCreated: req.body.dateCreated,
    });

    product = await product.save();

    if (!product) {
       return res.status(500).send('Product not created!');
    }
   return res.status(200).send(product);
});

router.put(`/:id`, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id!');
        }

        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        // Check if newQuantityOFProduct is provided in the request
        if (req.body.newQuantityOFProduct != null) {
            // Update the main quantity by adding the new quantity
            product.quantity += req.body.newQuantityOFProduct;

            // Update the new quantity and log the current date
            product.newQuantityOFProduct = req.body.newQuantityOFProduct;
            product.newQuantityDates.push(new Date());
        }

        // Update other fields if necessary
        product.name = req.body.name;
        product.description = req.body.description;
        product.vendor = req.body.vendor;
        product.category = req.body.category;
        product.price = req.body.price;

        // Save the product
        product = await product.save();
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});


// router.put('/:id/issue-stock', async (req, res) => {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//         return res.status(404).send('Product not found');
//     }

//     const { issuedQuantity } = req.body;

//     if (issuedQuantity > product.quantity - product.stockIssued) {
//         return res.status(400).send('Not enough stock available');
//     }

//     product.stockIssued += issuedQuantity;
//     product.stockRemaining = product.quantity - product.stockIssued;

//     await product.save();

//     res.status(200).send(product);
// });

router.put('/:orderId/items/:productId', async (req, res) => {
    const { orderId, productId } = req.params;
    const { quantityIssue } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      const item = order.orderItems.find(i => i.product.toString() === productId);
  
      if (item) {
        item.quantityIssue = quantityIssue;
        await order.save();
  
        // Optionally: Update stock in the product collection
        const product = await Product.findById(productId);
        product.stock -= quantityIssue;
        await product.save();
      }
  
      res.status(200).json({ message: 'Quantity issued updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update quantity issued.' });
    }
  });
  

router.delete(`/:id`, (req, res) => {
     Product.findByIdAndDelete({
        _id: req.params.id
    }).then((product) => {
        if (product) {
            return res.status(200).json({ success: true, message: 'Product deleted successfully' });
        }
        return res.status(404).json({ success: false, message: 'Product not found' });
    }).catch((err) => {
        return res.status(404).json({ success: false, error: err });
    })
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).send({ success: false, error: err })
    }
    res.status(200).send({
        productCount : productCount
    });
});

router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.status(200).json({ success: true, count: productCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router; 