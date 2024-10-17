const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

});

router.put(`/:id`, async (req, res) => {

    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const updateUser = await User.findByIdAndUpdate({
        _id: req.params.id
    },
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            passwordHash: newPassword,
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

router.post(`/login`, async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('User not found');
    };

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin  // Include isAdmin field
            },
            secret,
            {
                expiresIn: '1h'
            }
        )
        return res.status(200).send({ user: user.email, token: token });
    };
    return res.status(400).send('Password is wrong');
});

router.post(`/register`, async (req, res) => {
    let registerUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        department: req.body.department
    });

    registerUser = await registerUser.save();

    if (!registerUser) {
        res.status(404).send('This user no created');
    }
    res.status(200).send(registerUser);
})

router.delete(`/:id`, (req, res) => {
    try {
        User.findOneAndDelete({
            _id: req.params.id
        }).then((User) => {
            if (User) {
                return res.status(204).send('User deleted');
            } else {
               return res.status(404).send('User not deleted');
            }
        })
    } catch (error) {
        return res.status(500).send('Server error');
    }

});

router.get(`/get/count`, async (req,res)=> {
    const userCount = await User.countDocuments();

    if(!userCount){
        res.status(400).json({success: false});
    }
    res.status(200).send({
        userCount : userCount
    })
});

module.exports = router;