const express = require('express')
const db = require('./database');
const { authenticate } = require('./jwt');
const { authenticates } = require('./jwt');
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
router.post('/get-child-comment', (req, res) =>{
    // const {comment_input} = req.body.product_input;
    const comment_id = req.body.comment_id
    const sql = 'SELECT * FROM child_comment WHERE comment_id = ' + comment_id;
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get comment"})
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
        }
    })
})
router.post('/delete-child-comment/:id', authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    const sql = 'DELETE FROM child_comment WHERE id = ' + id;
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete comment"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
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
router.post('/reply-comment',authenticates(['admin', 'employee']), (req, res)=>{
    const {comment_input} = req.body;
    // if(!comment_input){
    //     res.status(400).json({code: 400, message:"invalid input value"})
    // }
    let sql = 'INSERT INTO child_comment (content, comment_date, comment_id) VALUES';
    if(comment_input){
        sql += `("${comment_input.content}","${formatDate()}", ${comment_input.comment_id})`
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
router.post('/delete-comment/:id', authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    const sql = 'DELETE FROM comments WHERE id = ' + id;
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error delete comment"})
        }else{
            res.status(200).send({code: 200, message:"insert success!"})
        }
    })
})

module.exports = router;