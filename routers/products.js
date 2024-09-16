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
    res.status(200).send(product);
});


router.get(`/:id`, async (req, res) => {
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

    const department = await Department.findById(req.body.department);
    if(!department) res.status(400).send('invalid department');


    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        vendor: req.body.vendor,
        department: req.body.department,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
        scrapPrice: req.body.scrapPrice,
        marketPtice: req.body.marketPtice,
        inlineFormulas: req.body.inlineFormulas,
        dateCreated: req.body.dateCreated,
    });

    product = await product.save();

    if (!product) {
        res.status(500).send('Product not created!');
    }
    res.status(200).send(product);
});

router.put(`/:id`, async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            res.status(400).send('Invalid Product Id!');
        }
    
        const category = await Category.findById(req.body.category);
        if(!category) res.status(400).send('invalid Category');
    
        const vendor = await Vendor.findById(req.body.vendor);
        if(!vendor) res.status(400).send('invalid vendor');
    
        const department = await Department.findById(req.body.department);
        if(!department) res.status(400).send('invalid department');
        
        const updProduct = await Product.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                name: req.body.name,
                description: req.body.description,
                vendor: req.body.vendor,
                department: req.body.department,
                category: req.body.category,
                quantity: req.body.quantity,
                price: req.body.price,
                scrapPrice: req.body.scrapPrice,
                marketPtice: req.body.marketPtice,
                inlineFormulas: req.body.inlineFormulas,
                dateCreated: req.body.dateCreated,
            },
            {
                new: true
            });
    
            if(!updProduct){
                res.status(500).send('Product not updated');
            }
            res.status(200).send(updProduct);
    } catch (error) {
        res.status(400).send(error,'Internal Server erorr');
    }

})


router.delete(`/:id`, (req, res) => {
     Product.findByIdAndDelete({
        _id: req.params.id
    }).then((product) => {
        if (product) {
            return res.status(200).send('Product deleted');
        }
        return res.status(404).send('Product not delted');
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

module.exports = router; 