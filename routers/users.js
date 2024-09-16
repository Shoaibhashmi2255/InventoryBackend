const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get(`/`, async (req, res) => {
    const getUser = await User.find().select('-passwordHash');

    if (!getUser) {
        res.status(500).send('User not Fetched');
    };
    res.status(200).send(getUser);
});

router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).send('Product not found in User');
    }
    res.status(200).send(user);
});

router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        department: req.body.department
    });

    user = await user.save();

    if (!user) {
        res.status(500).send('Post not created');
    }
    res.status(200).send(user);

    try {
        // const hasedPassword =  bcrypt.hashSync(req.body.password, 56);
       
    } catch (error) {
        console.log(error);
        
        res.status(500).send('error updating product');
    }

});

router.put(`/:id`, async (req, res) => {
    const updateUser = await User.findByIdAndUpdate({
        _id: req.params.id
    },
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            department: req.body.department
        },
        {
            new: true
        });

    if (!updateUser) {
        res.status(500).send('User not updated');
    }
    res.status(200).send(updateUser);
});

router.delete(`/:id`, (req, res) => {
    User.findOneAndDelete({
        _id: req.params.id
    }).then((User) => {
        if (User) {
            res.status(200).send('User deleted');
        } else {
            res.status(500).send('User not deleted');
        }
    })
});

module.exports = router;