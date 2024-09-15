const express = require('express');
const { Inventory } = require('../models/inventory');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const getInventory = await Inventory.find();

    if (!getInventory) {
        res.status(500).send('Inventory not Fetched');
    };
    res.status(200).send(getInventory);
});

router.get(`/:id`, async (req, res) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        res.status(500).send('Product not found in inventory');
    }
    res.status(200).send(inventory);
});

router.post(`/`, async (req, res) => {
    let inventory = new Inventory({
        name: req.body.name,
        category: req.body.category,
        vendor: req.body.vendor,
        quantity: req.body.quantity,
        price: req.body.price,
        marketPrice: req.body.marketPrice,
        scrapPrice: req.body.scrapPrice,
        remainingQty: req.body.remainingQty,
        totalIssued: req.body.totalIssued
    });

    inventory = await inventory.save();

    if (!inventory) {
        res.status(500).send('Post not created');
    }
    res.status(200).send(inventory);
});

router.put(`/:id`, async (req, res) => {
    const updateInventory = await Inventory.findByIdAndUpdate({
        _id: req.params.id
    },
        {
            name: req.body.name,
            category: req.body.category,
            vendor: req.body.vendor,
            quantity: req.body.quantity,
            price: req.body.price,
            marketPrice: req.body.marketPrice,
            scrapPrice: req.body.scrapPrice,
            remainingQty: req.body.remainingQty,
            totalIssued: req.body.totalIssued
        },
        {
            new: true
        });

    if (!updateInventory) {
        res.status(500).send('Inventory not updated');
    }
    res.status(200).send(updateInventory);

});

router.delete(`/:id`, (req, res) => {
    Inventory.findOneAndDelete({
        _id: req.params.id
    }).then((inventory) => {
        if (inventory) {
            res.status(200).send('Inventory deleted');
        } else {
            res.status(500).send('Inventory not deleted');
        }

    })
});

module.exports = router;



// {
//     "name":"Ball Point",
//     "category": "Electronics",
//     "vendor":"",
//     "quantity":"2",
//     "price":"13",
//     "marketPrice":"13",
//     "scrapPrice":"1",
//     "remainingQty":"2",
//     "totalIssued":"5"
// }