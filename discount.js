const express = require('express')
const db = require('./database')
const router = express.Router()
const { authenticates } = require('./jwt');
function generateSKU(name){
    const sku = name.replace(/\s+/g, "-");
    return sku;
}
function formatDate(){
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
router.post('/', (req, res) =>{
    // const {discount_input} = req.body.product_input;
    const sql = 'SELECT * FROM discounts  WHERE status = 1';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get discount"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/insert-discount' , authenticates(['admin', 'employee']), (req, res)=>{
    const {discount_input} = req.body;
    if(!discount_input){
        res.status(400).json({code: 400, message:"invalid input value"})
    }
    let sql = 'INSERT INTO discounts (discount_code, discount_type, discount_value,start_day, end_day, status) VALUES';
    if(discount_input){
        sql += `("${discount_input.discount_code}","${discount_input.discount_type}", ${discount_input.discount_value}, "${formatDate()}", "${discount_input.end_day}" , 1)`
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).json({code: 500, message:"error insert discount"})
        }else{
            res.status(200).json({code: 200, message:"insert success!"});
        }
    })
})
router.put('/update-discount/:id', authenticates(['admin', 'employee']) , (req, res) =>{
    const {discount_input} = req.body;
    const id = req.params.id;
    if(!discount_input){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = `UPDATE discounts SET discount_code = ?, discount_type = ?, discount_value = ?, start_day = ?, end_day = ? WHERE id = ?`;
    
    
    db.query(sql,[discount_input.discount_code, discount_input.discount_type, discount_input.discount_value, formatDate(), discount_input.end_day, id], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error update discount"})
            console.log(sql);
        }else{
            res.status(200).send({code: 200, message:"update success!"});
            console.log(sql);
        }
    })
})
router.put('/delete-discount', authenticates(['admin', 'employee']) , (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = 'UPDATE discounts SET status = 0 WHERE id IN (?)';
    
    console.log(sql);
    db.query(sql,[ids], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete discount"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;