
const express = require('express');
const db = require('./database');
const product = require('./product');
const category = require('./category');
const learn = require('./learn')
const app = express();
app.use(express.json());
app.use('/api/v1/product', product);
app.use('/api/v1/learn',learn );
app.use('/api/v1/category', category);
// PORT server
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})

