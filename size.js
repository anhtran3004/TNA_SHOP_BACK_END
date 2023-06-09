const express = require('express')
const db = require('./database')
const { authenticates } = require('./jwt');
const router = express.Router()

router.post('/insert-size' , authenticates(['admin', 'employee']), (req, res)=>{
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
router.put('/delete-size' , authenticates(['admin', 'employee']), (req, res) =>{
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
router.post('/delete-sizes/:id' , authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    let sql = `DELETE FROM sizes WHERE id=` + id
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting sizes'});
            console.log(sql)
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} sizes`});
            console.log(sql)
        }
    })
})
router.put('/update-size/:id' , authenticates(['admin', 'employee']), (req, res) =>{
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
router.post('/' , authenticates(['admin', 'employee']), (req, res) =>{
    let sql = `SELECT * FROM  sizes WHERE status = 1`;
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
router.post('/get-size-with-filter' , authenticates(['admin', 'employee']), (req, res) =>{
    let sql = `SELECT * FROM  sizes WHERE status = 1`;
    const {filter} = req.body; 
    const dbParams = [];
    if(filter){
        // add search condition
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (size LIKE ?)`;
            dbParams.push(searchValue);
        }
    }
    db.query(sql, dbParams, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get sizes'});
        }else{
            res.send({code: 200, message: `Get sizes sucess`, data: results} );
            console.log(sql);
        }
    })
})
module.exports = router;