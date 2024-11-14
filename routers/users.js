const { User } = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {

    const getUser = await User.find().select('-passwordHash').populate('branch department');

    if (!getUser) {
        res.status(500).send('User not Fetched');
    };
    res.status(200).send(getUser);
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    // Validate if ID is defined and is a valid MongoDB ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    try {
        // Fetch the user by ID and populate department and branch fields
        const user = await User.findById(userId)
            .populate('department')  // Populate department object
            .populate('branch');     // Populate branch object

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user); // Send the populated user object
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post(`/`, async (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
    };

    // Add department and branch only if they are provided
    if (req.body.department) {
        userData.department = req.body.department;
    }
    if (req.body.branch) {
        userData.branch = req.body.branch;
    }

    let user = new User(userData);
    try {
        user = await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('User not created');
    }
});


// router.put(`/:id`, async (req, res) => {
//     const userExist = await User.findById(req.params.id);
//     let newPassword;
//     if (req.body.password) {
//         newPassword = bcrypt.hashSync(req.body.password, 10);
//     } else {
//         newPassword = userExist.passwordHash;
//     }

//     const updateData = {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         isAdmin: req.body.isAdmin,
//         passwordHash: newPassword,
//     };

//     if (req.body.department) {
//         updateData.department = req.body.department;
//     }
//     if (req.body.branch) {
//         updateData.branch = req.body.branch;
//     }

//     try {
//         const updateUser = await User.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true }
//         );

//         if (!updateUser) {
//             res.status(500).send('User not updated');
//         } else {
//             res.status(200).send(updateUser);
//         }
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        passwordHash: req.body.password ? bcrypt.hashSync(req.body.password, 10) : userExist.passwordHash,
    };

    if (req.body.department) {
        updateData.department = req.body.department;
    }
    if (req.body.branch) {
        updateData.branch = req.body.branch;
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updateUser) {
            return res.status(500).send('User not updated');
        }
        res.status(200).send(updateUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post(`/login`, async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).populate({ path: 'department branch' });
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('User not found');
    };

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,  // Include isAdmin field,
                userEmail: user.email,
                userName: user.name,
                department: user.department?.name,
                branch: user.branch?.name
            },
            secret,
            {
                expiresIn: '1h'
            }
        )
        return res.status(200).send({ token: token });
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
        department: req.body.department,
        branch: req.body.branch
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

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(400).json({ success: false });
    }
    res.status(200).send({
        userCount: userCount
    })
});

module.exports = router;