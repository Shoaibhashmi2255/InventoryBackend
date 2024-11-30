const express = require('express');
const { Department } = require('../models/department');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const department = await Department.find();

    if (!department) {
        res.status(500).send('Department not fetched')
    }
    res.status(200).send(department);
});

router.get(`/:id`, async (req, res) => {
    const department = await Department.findById({ _id: req.params.id });

    if (!department) {
        res.status(500).send('Department not fetched')
    }
    res.status(200).send(department);
});


router.post(`/`, async (req, res) => {
    let department = new Department({
        name: req.body.name,
        branch: req.body.branch
    });

    department = await department.save();

    if (!department) {
        res.status(500).send('Department not created');
    }
    res.status(200).send(department);
});

router.put(`/:id`, async (req, res) => {
    const updateDepartment = await Department.findByIdAndUpdate({ _id: req.params.id },
        {
            name: req.body.name,
            branch: req.body.branch
        },
        {
            new: true
        });

        if(!updateDepartment){
            res.status(500).send('Department not found');
        }
        res.status(200).send(updateDepartment);

});

router.delete(`/:id`, (req, res) => {
    Department.findByIdAndDelete(req.params.id)
        .then((department) => {
            if (department) {
                return res.status(200).json({ success: true, message: 'Deprartment deleted' });  
            } else {
                return res.status(404).json({ success: false, message: 'Deprartment not found' });   
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error });  // Return here for the error case
        });
});


router.get(`/get/count`, async (req, res) => {
    try {
        const departmentCount = await Department.countDocuments();
        res.status(200).json({ success: true, count: departmentCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;