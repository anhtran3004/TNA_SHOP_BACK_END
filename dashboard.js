const express = require('express')
const db = require('./database')
const { authenticates } = require('./jwt');
const router = express.Router()
router.post('/calculate-revenue-follow-year', authenticates(['admin', 'employee']), (req, res) =>{
    const {year} = req.body; 
    let sql = 'SELECT SUM(total_price) AS total FROM orders WHERE status = 2 AND YEAR(created_date)=' + year;
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
router.post('/calculate-revenue-follow-month/', authenticates(['admin', 'employee']), (req, res) =>{
    const {month, year} = req.body; 
    let sql = 'SELECT SUM(total_price) AS total FROM orders WHERE status = 2 AND YEAR(created_date)=? AND MONTH(created_date)=?';
    console.log(sql);   
    // execute query
    db.query(sql,[year, month], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})

router.post('/calculate-revenue-follow-week/', authenticates(['admin', 'employee']), (req, res) =>{
    const {startDay, endDay} = req.body; 
    let sql = 'SELECT SUM(total_price) FROM orders WHERE status = 2 AND created_date BETWEEN ? AND ?';
    console.log(sql);   
    // execute query
    db.query(sql,[startDay, endDay], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/calculate-revenue-follow-day/', authenticates(['admin', 'employee']), (req, res) =>{
    const {year, month, day} = req.body; 
    let sql = 'SELECT SUM(total_price) AS total FROM orders WHERE status = 2 AND YEAR(created_date) = ? AND MONTH(created_date) = ? AND DAY(created_date) = ?';
    console.log(sql);   
    // execute query
    db.query(sql,[year, month, day], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching orders form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results});
            console.log(results);
        }
    }) 
})
router.post('/year/', authenticates(['admin', 'employee']), (req, res) =>{
    let sql = 'SELECT DISTINCT YEAR(created_date) AS year FROM orders WHERE status = 2';
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
router.post('/month/', authenticates(['admin', 'employee']), (req, res) =>{
    let sql = 'SELECT DISTINCT YEAR(created_date) AS year, MONTH(created_date) AS month FROM orders WHERE status = 2';
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
router.post('/date/', authenticates(['admin', 'employee']), (req, res) =>{
    let sql = 'SELECT DISTINCT YEAR(created_date) AS year, MONTH(created_date) AS month, DAY(created_date) AS day FROM orders WHERE status = 2';
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
