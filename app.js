const express = require ('express');
const app = express();
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');
const cors = require('cors');


//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

const api = process.env.API_URL;

// models
const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');



//Router
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);

//password'dkOn4wQbAUYp82mV'


mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
    console.log('localhost:3000 is running');
})