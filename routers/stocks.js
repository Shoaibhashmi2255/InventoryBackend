const Product = require('../models/product');
const Stock = require('../models/stock');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET route to fetch all stocks
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find().populate('product', 'name');  // Populates product details if needed
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving stocks', error });
    }
});


module.exports = router; 
