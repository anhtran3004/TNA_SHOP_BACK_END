const express = require('express')
const db = require('./database')
const { authenticates } = require('./jwt');
const router = express.Router()
function generateSKU(name){
    const sku = name.replace(/\s+/g, "-");
    return sku;
}
router.post('/', (req, res) =>{
    // const {category_input} = req.body.product_input;
    const sql = 'SELECT * FROM categories';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get categories"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/get-category-with-filter', (req, res) =>{
    // const {category_input} = req.body.product_input;
    let sql = 'SELECT * FROM categories WHERE 1=1 ';
    const {filter} = req.body;
    const dbParams = [];
    if(filter){
        // add search condition
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (categoryName LIKE ?)`;
            dbParams.push(searchValue);
        }
    }
    db.query(sql, dbParams, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get categories"})
            console.log(sql);
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
            console.log(sql);
        }
    })
})
router.post('/insert-category', authenticates(['admin', 'employee']) , (req, res)=>{
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
router.put('/update-category/:id' , authenticates(['admin', 'employee']), (req, res) =>{
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
router.put('/delete-category' , authenticates(['admin', 'employee']), (req, res) =>{
    const ids = req.body.ids;
    const status = req.body.status;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = 'UPDATE categories SET status = ? WHERE id IN (?)';
    
    console.log(sql);
    db.query(sql,[status, ids], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete category"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})
router.post('/delete-categories/:id' , authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    const sql = 'DELETE FROM categories WHERE id = ' + id;
    
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete category"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;