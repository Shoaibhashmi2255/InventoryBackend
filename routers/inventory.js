const { Inventory } = require('../models/inventory');
const { Category } = require('../models/category');
const { Vendor } = require('../models/vendor');
const { Department } = require('../models/department');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    let filter = {};

    if (req.query.categories) {
        filter.category = { $in: req.query.categories.split(',') };
    }

    if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: 'i' };
    }

    if (req.query.department) {
        filter.department = req.query.department;
    }

    if (req.query.vendor) {
        filter.vendor = req.query.vendor;
    }

    // Populate product details when fetching inventory
    const getInventory = await Inventory.find(filter)
        .populate({
            path: 'product', // Populate the product field
            select: 'name price' // Only select the fields you want
        })
        // .populate('category department vendor');

    if (!getInventory) {
        return res.status(500).send('Inventory not fetched');
    }

    res.status(200).send(getInventory);
});


router.get(`/:id`, async (req, res) => {
    const inventory = await Inventory.findById(req.params.id).populate('category department vendor');

    if (!inventory) {
        res.status(500).send('Product not found in inventory');
    }
    res.status(200).send(inventory);
});

router.post(`/`, async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) res.status(400).send('invalid Category');

    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) res.status(400).send('invalid vendor');

    const department = await Department.findById(req.body.department);
    if (!department) res.status(400).send('invalid department');

    let inventory = new Inventory({
        name: req.body.name,
        category: req.body.category,
        vendor: req.body.vendor,
        quantity: req.body.quantity,
        previousMonthInventory: req.body.previousMonthInventory,
        price: req.body.price,
        marketPrice: req.body.marketPrice,
        scrapPrice: req.body.scrapPrice,
        totalIssued: req.body.totalIssued,
        remainingQty: req.body.remainingQty,
    });

    inventory = await inventory.save();

    if (!inventory) {
        res.status(500).send('Post not created');
    }
    res.status(200).send(inventory);
});

router.put(`/:id`, async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id!');
    }

    const category = await Category.findById(req.body.category);
    if (!category) res.status(400).send('invalid Category');

    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) res.status(400).send('invalid vendor');

    const department = await Department.findById(req.body.department);
    if (!department) res.status(400).send('invalid department');

    const updateInventory = await Inventory.findByIdAndUpdate({
        _id: req.params.id
    },
        {
            name: req.body.name,
            category: req.body.category,
            vendor: req.body.vendor,
            quantity: req.body.quantity,
            previousMonthInventory: req.body.previousMonthInventory,
            price: req.body.price,
            marketPrice: req.body.marketPrice,
            scrapPrice: req.body.scrapPrice,
            totalIssued: req.body.totalIssued,
            remainingQty: req.body.remainingQty,
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