const express = require ('express');
const app = express();
const morgan = require('morgan');
require('dotenv/config');
const mongoose = require('mongoose');
const cors = require('cors');
const authJWT = require('./helpers/jwt');
require('./tasks/monthlytasks/montly-reset-quantites');
const path = require('path');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());
// app.use(authJWT());


const api = process.env.API_URL;

// models
const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const branchRouter = require('./routers/branches');
const departmentRouter = require('./routers/departments');
const inventoryRouter = require('./routers/inventory');
const userRouter = require('./routers/users');
const vendorRouter = require('./routers/vendors');
const orderRouter = require('./routers/orders');
const stockRouter = require('./routers/stocks');
const historyRouter = require('./history/stockHistory/productHistory');





//Router
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/branches`, branchRouter);
app.use(`${api}/departments`, departmentRouter);
app.use(`${api}/inventory`, inventoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/vendors`, vendorRouter);
app.use(`${api}/orders`,orderRouter);
app.use(`${api}/stocks`,stockRouter);
app.use(`${api}/phistory`,historyRouter);




app.get('/', (req, res) => {
  res.send('Hello World');
});


//password'dkOn4wQbAUYp82mV'


mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log(err);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});