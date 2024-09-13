const express = require ('express');
const app = express();
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');
const productRouter = require('./routers/products');



//Middleware
app.use(express.json());
app.use(morgan('tiny'));


const api = process.env.API_URL;





//Router
app.use(`${api}/products`, productRouter);

//password'dkOn4wQbAUYp82mV'


mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
    console.log('localhost:3000 is running');
})