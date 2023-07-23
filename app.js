const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
require('dotenv/config');
const authJwt = require('./helper/jwt');


// middleware
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


// database connect
mongoose.connect(process.env.CONNECTION_STRING,{
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('DATABASE is connected to our app....')
})
.catch((error)=>{
    console.log(error)
})


// server
app.listen(8000, () => {
    console.log(api);
    console.log("server is running http:localhost:8000");
})