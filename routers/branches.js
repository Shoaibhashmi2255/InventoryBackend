const express = require('express');
const { Branch } = require('../models/branch');
const router = express.Router();


router.get(`/`, async (req, res) => {
    try {
        const branch = await Branch.find();

        if (!branch) {
            res.status(500).send('Branch not found');
        }
        res.status(200).send(branch);
    } catch (error) {
        console.log(error, 'error fetching products');
        res.status(500).json({ success: false, message: 'internal server error' })
    }

});

router.get(`/:id`, async (req, res) => {
    try {
        const findBranch = await Branch.findById({ _id: req.params.id });
        if (!findBranch) {
            res.status(500).send('Branch not found');
        }
        res.status(200).send(findBranch);
    } catch (error) {
        res.status(404).send('Branch not found');
    }

})

router.post(``, async (req, res) => {
    let branch = new Branch({
        name: req.body.name,
        address: req.body.address
    });

    branch = await branch.save();

    try {
        if (!branch) {
            res.status(500).send('Branchnot Created!');
        }
        res.status(200).send(branch);
    } catch (error) {
        console.log(error, 'Post not created');
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.put(`/:id`, async (req, res) => {
    const branch = await Branch.findByIdAndUpdate(
        {
            _id: req.params.id
        },
        {
            name: req.body.name,
            address: req.body.address
        },
        {
            new: true
        }
    );

    try {
        if (!branch) {
            res.status(500).send('Branch not updated');
        }
        res.status(200).send(branch);
    } catch (error) {
        console.log(error, 'Post not created');
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});

router.delete(`/:id`, (req, res) => {
    Branch.findByIdAndDelete(
        {
            _id: req.params.id
        }).then((branch) => {
            if (branch) {
                return res.status(200).json({ success: true, message: 'Branch deleted' });
            }
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }).catch((error) => {
            return res.status(500).json({ success: false, message: 'Internal server error', error: error });
        })
});

router.get(`/get/count`, async (req, res) => {
    try {
        const branchCount = await Branch.countDocuments();
        res.status(200).json({ success: true, count: branchCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// router.get(`/get/count`, async (req, res) => {
//     const userCount = await User.countDocuments();
//     if (!userCount) {
//       res.status(500).json({ success: false });
//     }
//     res.send({
//         userCount: userCount,
//     });
//   });


module.exports = router;