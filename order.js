const express = require('express')
const db = require('./database')
const router = express.Router()
const formatDate = require('./formatDate');
router.post('/insert-order', (req, res) =>{
    const {order_input} = req.body; 
    let sql = 'INSERT INTO orders (name, email, address, phone, ship_name, created_date, method_delivery, user_id, shipping_fee) VALUES';
    if(order_input){
        sql+= ` ("${order_input.name}", "${order_input.email}","${order_input.address}", "${order_input.phone}", "${order_input.ship_name}", "${formatDate()}","${order_input.method_delivery}", ${order_input.user_id}, ${order_input.shipping_fee})`;
    }
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results})
        }
    }) 
})
router.post('/insert-order-product', (req, res) =>{
    const {order_input} = req.body; 
    let sql = 'INSERT INTO order_products (order_id, product_id, price, quantity, color, size) VALUES';
    if(order_input){
        sql+= ` (${order_input.order_id}, ${order_input.product_id}, ${order_input.price}, ${order_input.quantity}, "${order_input.color}", "${order_input.size}")`;
    }
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!'})
        }
    }) 
})
module.exports = router;