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

router.delete(`/:id`, (req,res)=> {
    Department.findByIdAndDelete({
        _id: req.params.id
    }).then((department)=> {
        if(department){
            res.status(200).send('Department Deleted');
        }
        res.status(500).send('Department no deleted');
    }).catch((error)=> {
        res.status(404).json({error:error});
    })
});

module.exports = router;