const express = require('express')
const db = require('./database')
const router = express.Router()

router.post('/insert-size', (req, res)=>{
    const {size} = req.body;
    let sql = `INSERT INTO sizes (size) VALUES`;
    if(size){
        sql += `("${size}")`;
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"Error insert size"});
        }else{
            res.status(200).send({code: 200, message:"insert size sucess"});
        }
    })
});
router.post('/delete-size', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        return
    }
    let sql = `UPDATE sizes SET status = 0 WHERE id IN (?)`
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting sizes'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} sizes`});
        }
    })
})
router.put('/update-size/:id', (req, res) =>{
    const size = req.body.size;
    const id = req.params.id;

    let sql = `UPDATE sizes SET size = ? WHERE id = ?`
    db.query(sql, [size, id], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error updating sizes'});
        }else{
            res.send({code: 200, message: `Updated ${results.affectedRows} sizes`});
            console.log(sql);
        }
    })
})
router.post('/', (req, res) =>{
    let sql = `SELECT * FROM  sizes`;
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get sizes'});
        }else{
            res.send({code: 200, message: `Get sizes sucess`, data: results} );
            console.log(sql);
        }
    })
})
module.exports = router;