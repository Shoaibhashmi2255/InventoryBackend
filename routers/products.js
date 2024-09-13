const express = require('express');
const router = express.Router();

router.get(`/`,(req,res)=>{
    const product = {
        id : 1,
        Name : 'ball'
    }
    res.send(product);    
})


router.post(`/`,(req,res)=>{
    const products = new Product({
        name: req.body.name,
        countInStock: req.body.countInStock
    })
    products.save().then((success => {
        res.status(201).send(success);
    })).catch((err)=>{
        res.status(500).send(err);
    })
})

module.exports = router;