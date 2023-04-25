const express = require('express')
const db = require('./database');
const { authenticate } = require('./jwt');
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
    // const {comment_input} = req.body.product_input;
    const sql = 'SELECT * FROM comments WHERE status = 1';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get comment"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/get-comment-follow-product/:id', (req, res) =>{
    const id = req.params.id;
    // const {comment_input} = req.body.product_input;
    const sql = 'SELECT * FROM comments WHERE status = 1 and product_id='+ id;
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get comment"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/insert-comment',authenticate('user'), (req, res)=>{
    const {comment_input} = req.body;
    const user_id = req.user.id;
    const username = req.user.user
    if(!comment_input){
        res.status(400).json({code: 400, message:"invalid input value"})
    }
    let sql = 'INSERT INTO comments (content, rating, comment_date, user_id, product_id, username) VALUES';
    if(comment_input){
        sql += `("${comment_input.content}",${comment_input.rating},"${formatDate()}", ${user_id},${comment_input.product_id}, "${username}")`
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).json({code: 500, message:"error insert comment"})
        }else{
            res.status(200).json({code: 200, message:"insert success!"});
        }
    })
})
router.put('/delete-comment', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"invalid input value"});
        return;
    }
    const sql = 'UPDATE comments SET status = 0 WHERE id IN (?)';
    
    console.log(sql);
    db.query(sql,[ids], (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete comment"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;