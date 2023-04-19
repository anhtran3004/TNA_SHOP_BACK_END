const express = require('express')
const db = require('./database');
const router = express.Router()
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
    // const {category_input} = req.body.product_input;
    const sql = 'SELECT * FROM campaigns WHERE status = 1';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get campaigns"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/insert-campaign', (req, res)=>{
    const {campaign_input} = req.body;
    if(!campaign_input){
        res.status(400).json({code: 400, message:"invalid input value"})
    }
    let sql = 'INSERT INTO campaigns (name, start_day, end_day,thumb, campaign_description, sku) VALUES';
    if(campaign_input){
        sql += `("${campaign_input.name}", "${formatDate()}", "${campaign_input.end_day}","${campaign_input.thumb}", "${campaign_input.campaign_description}", "${generateSKU(campaign_input.name)}")`
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).json({code: 500, message:"error insert campaign"})
        }else{
            res.status(200).json({code: 200, message:"insert success!"});
        }
    })
})
router.put('/update-campaign/:id', (req, res) =>{
    const {campaign_input} = req.body;
    const id = req.params.id;
    if(!campaign_input){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = `UPDATE campaigns SET name = ?, sku = ?, thumb=?, end_day = ?, campaign_description = ? WHERE id = ?`;
    
    
    db.query(sql,[campaign_input.name, generateSKU(campaign_input.name), campaign_input.thumb, campaign_input.end_day, campaign_input.campaign_description, id], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error update campain"})
            console.log(sql);
        }else{
            res.status(200).send({code: 200, message:"update success!"});
            console.log(sql);
        }
    })
})
router.put('/delete-campaign', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = 'UPDATE campaigns SET status = 0 WHERE id IN (?)';
    
    console.log(sql);
    db.query(sql,[ids], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete campaign"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;