const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!Category) {
        res.status(500).json({ success: false })
    }
    res.status(201).send(categoryList);
});

router.get(`/:id`, async (req, res) => {
    const categoryById = await Category.findById({ _id: req.params.id });

    if (!categoryById) {
        res.status(500).send({ success: false })
    }
    res.status(201).send(categoryById);
})

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon
    });

    category = await category.save();

    if (!category) {
        res.status(404).send('Category can not be created');
    }

    res.status(201).send(category);
});

router.put(`/:id`, async (req, res) => {
    const updateCategory = await Category.findByIdAndUpdate(
        {
            _id: req.params.id
        },
        {
            name: req.body.name,
            icon: req.body.icon
        },
        {
            new: true
        }
    )

    if(!updateCategory){
        res.status(500).send('Category not updated!');
    }
    res.status(201).send(updateCategory);
})

router.delete(`/:id`, (req, res) => {
    Category.findOneAndDelete({ _id: req.params.id }).then((category) => {
        if (category) {
            res.status(200).send('category deleted');
        } else {
            res.status(404).send('category not deleted')
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    })
});





module.exports = router;