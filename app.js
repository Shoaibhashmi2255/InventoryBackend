const express = require ('express');
const app = express();
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');




//Middleware
app.use(express.json());
app.use(morgan('tiny'));


const api = process.env.API_URL;
console.log('API_URL:',api);




app.get(`${api}/products`,(req,res)=>{
    const product = {
        id : 1,
        Name : 'ball'
    }
    res.send(product);    
})


app.post(`${api}/products`,(req,res)=>{
    try {
        const newProduct = req.body;        
        res.send(newProduct);
    } catch (error) {
        console.log(error);   
    }   
})

//password'dkOn4wQbAUYp82mV'


mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
    console.log('localhost:3000 is running');
})