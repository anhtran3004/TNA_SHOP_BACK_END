const express = require('express')
const db = require('./database');
const { authenticates } = require('./jwt');
const router = express.Router()
router.post('/date/', authenticates(['admin', 'employee']), (req, res) =>{
    let sql = `SELECT DISTINCT YEAR(created_date) AS year, MONTH(created_date) AS month, DAY(created_date) AS day FROM users WHERE role = 'user'`;
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/year/',authenticates(['admin', 'employee']), (req, res) =>{
    let sql = `SELECT DISTINCT YEAR(created_date) AS year FROM users WHERE role = 'user'`;
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/month/',authenticates(['admin', 'employee']), (req, res) =>{
    let sql = `SELECT DISTINCT YEAR(created_date) AS year, MONTH(created_date) AS month FROM users WHERE role = 'user'`;
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/get-new-users-follow-day/',authenticates(['admin', 'employee']), (req, res) =>{
    const {year, month, day} = req.body; 
    let sql = 'SELECT COUNT(*) AS new_users FROM users WHERE YEAR(created_date) = ? AND MONTH(created_date) = ? AND DAY(created_date) = ? AND role=?';
    db.query(sql,[year, month, day, 'user'], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            res.status(200).send({code: 200, message:'success!', data: results});
        }
    }) 
})
router.post('/get-new-users-follow-year',authenticates(['admin', 'employee']), (req, res) =>{
    const {year} = req.body; 
    let sql = 'SELECT COUNT(*) AS new_users FROM users WHERE YEAR(created_date) = ? AND role=? ORDER BY created_date DESC';
    db.query(sql,[year, 'user'], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            res.status(200).send({code: 200, message:'success!', data: results});
        }
    }) 
})
router.post('/get-new-users-follow-month/',authenticates(['admin', 'employee']), (req, res) =>{
    const {month, year} = req.body; 
    let sql = 'SELECT COUNT(*) AS new_users FROM users WHERE YEAR(created_date) = ? AND MONTH(created_date) = ? AND role=? ORDER BY created_date DESC';
    console.log(sql);   
    // execute query
    db.query(sql,[year, month, 'user'], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/get-hot-product-list/', authenticates(['admin', 'employee']), (req, res) =>{
    let sql = 'SELECT product_id, order_products.name, SUM(quantity) AS total FROM order_products join orders on orders.id = order_products.order_id WHERE month(created_date) = month(now()) GROUP BY product_id, order_products.name order by total DESC LIMIT 0, 20';
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})

module.exports = router;
