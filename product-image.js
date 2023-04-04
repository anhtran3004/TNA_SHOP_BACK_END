const express = require('express')
const db = require('./database')
const router = express.Router()

router.post('/insert-image', (req, res)=>{
    const {input} = req.body;
    let sql = `INSERT INTO product_images (product_id, image) VALUES`;
    if(input){
        sql += `(${input.productId}, "${input.image}")`;
    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"Error insert image"});
        }else{
            res.status(200).send({code: 200, message:"insert image sucess"});
        }
    })
});
router.delete('/delete-image', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        return
    }
    let sql = `DELETE FROM product_images WHERE id IN (?)`
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting images'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} images`});
        }
    })
})
router.put('/update-image/:id', (req, res) =>{
    const image = req.body.image;
    const id = req.params.id;

    let sql = `UPDATE product_images SET image = ? WHERE id = ?`
    db.query(sql, [image, id], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error updating images'});
        }else{
            res.send({code: 200, message: `Updated ${results.affectedRows} images`});
            console.log(sql);
        }
    })
})
router.post('/', (req, res) =>{
    const product_id = req.body.product_id;
    if(!product_id){
        res.status(400).send({code: 400, message:"Invalid input value"})
    }
    let sql = `SELECT image FROM product_images WHERE product_id=${product_id}`;
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get images'});
        }else{
            res.send({code: 200, message: `Get images sucess`, data: results} );
            console.log(sql);
        }
    })
})
module.exports = router;