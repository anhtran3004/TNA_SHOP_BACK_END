const express = require('express')
const db = require('./database')
const router = express.Router()
router.post('/date/', (req, res) =>{
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
router.post('/year/', (req, res) =>{
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
router.post('/month/', (req, res) =>{
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
router.post('/get-new-users-follow-day/', (req, res) =>{
    const {year, month, day} = req.body; 
    let sql = 'SELECT COUNT(*) AS new_users FROM users WHERE YEAR(created_date) = ? AND MONTH(created_date) = ? AND DAY(created_date) = ? AND role=?';
    console.log(sql);   
    // execute query
    db.query(sql,[year, month, day, 'user'], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/get-new-users-follow-year', (req, res) =>{
    const {year} = req.body; 
    let sql = 'SELECT COUNT(*) AS new_users FROM users WHERE YEAR(created_date) = ? AND role=? ORDER BY created_date DESC';
    console.log(sql);   
    // execute query
    db.query(sql,[year, 'user'], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/get-new-users-follow-month/', (req, res) =>{
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
router.post('/get-hot-product-list/', (req, res) =>{
    let sql = 'SELECT product_id, name, SUM(quantity) AS total FROM order_products GROUP BY product_id, name order by total DESC';
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
