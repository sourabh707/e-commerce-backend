const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
require('dotenv/config');
const authJwt = require('./helper/jwt');
const api = process.env.API_URL;

// middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(authJwt);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");



app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


mongoose.connect(process.env.CONNECTION_STRING,{
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('DATABASE is connected to our app....')
})
.catch((error)=>{
    console.log(error)
})

app.listen(3000, () => {
    console.log(api);
    console.log("server is running http:localhost:3000");
})