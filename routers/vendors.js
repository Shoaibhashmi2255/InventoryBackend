const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const getVendor = await Vendor.find();

    if (!getVendor) {
        res.status(500).send('Vendor not Fetched');
    };
    res.status(200).send(getVendor);
});

router.get(`/:id`, async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        res.status(500).send('Product not found in Vendor');
    }
    res.status(200).send(vendor);
});

router.post(`/`, async (req, res) => {
    let vendor = new Vendor({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isWorking: req.body.isWorking,
        price: req.body.price,
        vendorType: req.body.vendorType
    });

    vendor = await vendor.save();

    if (!vendor) {
        res.status(500).send('Post not created');
    }
    res.status(200).send(vendor);
});

router.put(`/:id`, async (req, res) => {
    const updateVendor = await Vendor.findByIdAndUpdate({
        _id: req.params.id
    },
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            isWorking: req.body.isWorking,
            price: req.body.price,
            vendorType: req.body.vendorType
        },
        {
            new: true
        });

    if (!updateVendor) {
        res.status(500).send('Vendor not updated');
    }
    res.status(200).send(updateVendor);

});

router.delete(`/:id`, (req, res) => {
    Vendor.findOneAndDelete({
        _id: req.params.id
    }).then((Vendor) => {
        if (Vendor) {
            res.status(200).send('Vendor deleted');
        } else {
            res.status(500).send('Vendor not deleted');
        }

    })
});

module.exports = router;