const express = require('express')
const db = require('./database');
const { authenticate } = require('./jwt');
const router = express.Router()

router.post('/insert-favorite',authenticate('user'), (req, res)=>{
    const {product_id} = req.body;
    const user_ID = req.user.id;
    console.log(user_ID);
    let sql = `INSERT INTO favorites (user_id, product_id) VALUES`;
    if(product_id){
        sql += `(${user_ID}, ${product_id})`;
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"Error insert color"});
        }else{
            res.status(200).send({code: 200, message:"insert color sucess"});
        }
    })
});
router.post('/delete-favorite/:id',authenticate('user'), (req, res) =>{
    const id = req.body.id;
    let sql = `DELETE FROM favorites WHERE id=` + id
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting colors'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} colors`});
        }
    })
})
router.post('/',authenticate('user'), (req, res) =>{
    let sql = `SELECT * FROM favorites`;
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get colors'});
        }else{
            res.send({code: 200, message: `Get colors sucess`, data: results} );
            console.log(sql);
        }
    })
})
module.exports = router;