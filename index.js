
const express = require('express');
const db = require('./database');
const product = require('./product');
const learn = require('./learn')
const app = express();
app.use(express.json());
app.use('/api/v1/product', product);
app.use('/api/v1/learn',learn );
// PORT server
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})

