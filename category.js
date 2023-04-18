const express = require('express')
const db = require('./database')
const router = express.Router()
function generateSKU(name){
    const sku = name.replace(/\s+/g, "-");
    return sku;
}
router.post('/', (req, res) =>{
    // const {category_input} = req.body.product_input;
    const sql = 'SELECT * FROM categories WHERE status = 1';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get categories"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/insert-category', (req, res)=>{
    const {category_input} = req.body;
    if(!category_input){
        res.status(400).json({code: 400, message:"invalid input value"})
    }
    let sql = 'INSERT INTO categories (categoryName, sku, status) VALUES';
    if(category_input){
        sql += `("${category_input.name}", "${generateSKU(category_input.name)}", 1)`
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).json({code: 500, message:"error insert category"})
        }else{
            res.status(200).json({code: 200, message:"insert success!"});
        }
    })
})
router.put('/update-category/:id', (req, res) =>{
    const {category_input} = req.body;
    const id = req.params.id;
    if(!category_input){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = `UPDATE categories SET categoryName = ?, sku = ? WHERE id = ?`;
    
    
    db.query(sql,[category_input.name, generateSKU(category_input.name), id], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error update category"})
        }else{
            res.status(200).send({code: 200, message:"update success!"});
        }
    })
})
router.put('/delete-category', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = 'UPDATE categories SET status = 0 WHERE id IN (?)';
    
    console.log(sql);
    db.query(sql,[ids], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete category"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;