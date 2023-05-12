const express = require('express')
const db = require('./database')
const router = express.Router()
const { authenticates } = require('./jwt');

router.post('/insert-color', authenticates(['admin', 'employee']) , (req, res)=>{
    const {color} = req.body;
    let sql = `INSERT INTO colors (name) VALUES`;
    if(color){
        sql += `("${color}")`;
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
router.put('/delete-color' , authenticates(['admin', 'employee']), (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        return
    }
    let sql = `UPDATE colors SET status = 0 WHERE id IN (?)`
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting colors'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} colors`});
        }
    })
})
router.post('/delete-colors/:id' , authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    let sql = `DELETE FROM colors WHERE id=` + id
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting colors'});
            console.log(sql)
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} colors`});
            console.log(sql)
        }
    })
})
router.put('/update-color/:id', authenticates(['admin', 'employee']) , (req, res) =>{
    const color = req.body.color;
    const id = req.params.id;

    let sql = `UPDATE colors SET name = ? WHERE id = ?`
    db.query(sql, [color, id], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error updating colors'});
        }else{
            res.send({code: 200, message: `Updated ${results.affectedRows} colors`});
            console.log(sql);
        }
    })
})
router.post('/', (req, res) =>{
    let sql = `SELECT * FROM colors WHERE status = 1`;
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
router.post('/get-color-with-filter', (req, res) =>{
    let sql = `SELECT * FROM colors WHERE status = 1`;
    const {filter} = req.body;
    const dbParams = [];
    if(filter){
        // add search condition
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (name LIKE ?)`;
            dbParams.push(searchValue);
        }
    }
    db.query(sql, dbParams, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get colors'});
        }else{
            res.send({code: 200, message: `Get colors sucess`, data: results} );
            console.log(sql);
        }
    })
})
module.exports = router;