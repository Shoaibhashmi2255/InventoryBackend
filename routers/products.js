const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const product = await Product.find();

    if (!product) {
        res.status(500).send({ success: false, error: err })
    }
    res.status(200).send(product);
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById({
        _id: req.params.id
    });

    if (!product) {
        res.status(500).send('Product not found');
    }
    res.status(200).send(product);
});

router.post(`/`, async (req, res) => {
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
})


router.delete(`/:id`, async (req, res) => {
    const delProduct = await Product.findByIdAndDelete({
        _id: req.params.id
    }).then((product) => {
        if (product) {
            return res.status(500).send('Product not deleted');
        }
        return res.status(200).send('Product delted');
    }).catch((err) => {
        return res.status(404).json({ success: false, error: err });
    })
});

module.exports = router; 