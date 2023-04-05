
const express = require('express');
const db = require('./database');
const product = require('./product');
const category = require('./category');
const size = require('./size');
const productImage = require('./product-image');
const color = require('./color');
const learn = require('./learn');
const auth = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/v1/product', product);
app.use('/api/v1/learn',learn );
app.use('/api/v1/category', category);
app.use('/api/v1/size', size);
app.use('/api/v1/product-image', productImage);
app.use('/api/v1/color', color);
app.use('/api/v1/auth', auth);
// PORT server
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})

