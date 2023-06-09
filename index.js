
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// Sử dụng body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const product = require('./product');
const category = require('./category');
const campaign = require('./campaign');
const discount = require('./discount');
const size = require('./size');
const dashboard = require('./dashboard');
const user = require('./user');
const order = require('./order');
const forgotPassword = require('./forgot-password');
const comment = require('./comment');
const favorite = require('./favorite');
const statistical = require('./statistical');
const productImage = require('./product-image');
const color = require('./color');
const contact = require('./contact');
const auth = require('./auth');

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json());
app.use('/api/v1/product', product);
app.use('/api/v1/category', category);
app.use('/api/v1/campaign', campaign);
app.use('/api/v1/discount', discount);
app.use('/api/v1/size', size);
app.use('/api/v1/dashboard', dashboard);
app.use('/api/v1/user', user);
app.use('/api/v1/order', order);
app.use('/api/v1/contact', contact);
app.use('/api/v1/comment', comment);
app.use('/api/v1/favorite', favorite);
app.use('/api/v1/statistical', statistical);
app.use('/api/v1/forgot-password', forgotPassword);
app.use('/api/v1/product-image', productImage);
app.use('/api/v1/color', color);
app.use('/api/v1/auth', auth);
// PORT server
const port = process.env.PORT || 4000;

app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})

