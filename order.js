const express = require('express')
const db = require('./database')
const router = express.Router()
const formatDate = require('./formatDate');
router.post('/insert-order', (req, res) =>{
    const {order_input} = req.body; 
    let sql = 'INSERT INTO orders (name, email, address, phone, ship_name, created_date, method_delivery, user_id, shipping_fee,total_price) VALUES';
    if(order_input){
        sql+= ` ("${order_input.name}", "${order_input.email}","${order_input.address}", "${order_input.phone}", "${order_input.ship_name}", "${formatDate()}","${order_input.method_delivery}", ${order_input.user_id}, ${order_input.shipping_fee}, ${order_input.total_price})`;
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
    let sql = 'INSERT INTO order_products (order_id, product_id, price, name, thumb, quantity, color, size) VALUES';
    if(order_input){
        sql+= ` (${order_input.order_id}, ${order_input.product_id}, ${order_input.price},"${order_input.name}","${order_input.thumb}", ${order_input.quantity}, "${order_input.color}", "${order_input.size}")`;
    }
    // console.log(sql);   
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
router.post('/update-order-product/:id', (req, res) =>{
    const id = req.params.id;
    let sql = 'UPDATE  orders SET shipped_date = "' + formatDate() + '" WHERE id = ' + id;
    // console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
            console.log(sql)
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!'})
            console.log(sql)
        }
    }) 
})
router.post('/update-reason-remove/:id', (req, res) =>{
    const id = req.params.id;
    const reason = req.body.reason
    let sql = 'UPDATE  orders SET reason_remove = "' + reason + '" WHERE id = ' + id;
    // console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
            console.log(sql)
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!'})
            console.log(sql)
        }
    }) 
})
router.post('/get-order-follow-user/:id', (req, res) =>{
    const {status} = req.body;
    const userId = req.params.id;
    let sql = 'SELECT * FROM orders WHERE status='+ status + ' and user_id = '+ userId;
    // if(status && status.length > 0){
    //     sql += ` AND status IN (${status.join()})`;
    // }
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
router.post('/', (req, res) =>{
    const {status} = req.body
    let sql = 'SELECT * FROM orders WHERE status='+ status + ' ORDER BY created_date DESC';
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
router.post('/get-reason/:id', (req, res) =>{
    const id = req.params.id;
    let sql = 'SELECT reason_remove FROM orders WHERE id = ' + id;
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
router.post('/get-list-order', (req, res) =>{
    let sql = 'SELECT * FROM orders';
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
router.post('/get-order', (req, res) =>{
    const {status, filter, sort} = req.body; 
    const dbParams = [];
    let sql = 'SELECT * FROM orders WHERE status='+ status ;
    if(filter){
        if(filter.created_date){
            sql += ` AND created_date BETWEEN "${filter.created_date.min}" AND "${filter.created_date.max}"`;
        }
        // add search condition
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR address LIKE ?)`;
            dbParams.push(searchValue, searchValue, searchValue, searchValue);
        }
    }
    if(sort && sort.field && sort.order){
        sql += ` ORDER BY ${sort.field} ${sort.order}`;
    }
    console.log(sql);   
    // execute query
    db.query(sql,dbParams, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
            console.log(sql); 
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results})
            console.log(sql); 
        }
    }) 
})
router.post('/order-product/:id', (req, res) =>{
    const id = req.params.id; 
    let sql = 'SELECT * FROM order_products WHERE order_id=' + id;
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
router.put('/change-status/:id', (req, res) =>{
    const id = req.params.id;
    const {status} = req.body;
    let sql = 'UPDATE orders SET status = '+ status + ' WHERE id=' + id;
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
module.exports = router;