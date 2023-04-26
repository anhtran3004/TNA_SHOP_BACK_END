const express = require('express')
const router = express.Router()
const db = require('./database');
const { authenticate } = require("./jwt");
const formatDate = require('./formatDate');

router.post('/', (req, res) =>{
    // const {contact_input} = req.body.product_input;
    const sql = 'SELECT * FROM contacts';
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).send({code: 500, message:"error get contact"})
            console.log(sql);
        }else{
            res.status(200).send({code: 200, message:"success", data: results});
            console.log(sql);
        }
    })
})
router.post('/insert-contact', (req, res)=>{
    const {contact_input} = req.body;
    if(!contact_input){
        res.status(400).json({code: 400, message:"invalid input value"})
    }
    let sql = 'INSERT INTO contacts (email, name, message, subject, phone, created_date) VALUES';
    if(contact_input){
        sql += `("${contact_input.email}","${contact_input.name}","${contact_input.message}", "${contact_input.subject}","${contact_input.phone}", "${formatDate()}")`

    }
    console.log(sql);
    db.query(sql, (error, results) =>{
        if(error){
            res.status(500).json({code: 500, message:"error insert contact"})
        }else{
            res.status(200).json({code: 200, message:"insert success!"});
        }
    })
})
router.post('/delete-contact/:id',authenticate('admin'), (req, res) =>{
    const id = req.params.id;
    let sql = `DELETE FROM contacts WHERE id=` + id
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting contacts'});
            console.log(sql);
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} contacts`});
            console.log(sql);
        }
    })
})
module.exports = router;