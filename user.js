const express = require('express')
const db = require('./database')
const router = express.Router()
const bcrypt = require('bcrypt');
const formatDate = require('./formatDate');
const { createUser } = require('./modelUser');
async function HashedPassword(password){
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
router.post('/insert-user',async (req, res)=>{
    const {user_input} = req.body;
    
        const result = await createUser(user_input.username, user_input.email, user_input.password, user_input.name, user_input.phone, user_input.address, formatDate(), user_input.role_id);
        res.status(200).send({code: 200, message:"insert size sucess", data: result});
});
router.put('/delete-user', (req, res) =>{
    const ids = req.body.ids;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        return
    }
    let sql = `UPDATE users SET status = 0 WHERE id IN (?)`
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting users'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} users`});
        }
    })
})
router.put('/update-user/:id', (req, res) =>{
    const {user_input} = req.body;
    const id = req.params.id;
    // const password = hashedPassword(user_input.password)
    let sql = `UPDATE users SET email = ?, name = ?, phone = ?, address = ?, role_id = ? WHERE id = ?`
    db.query(sql, [user_input.email, user_input.name, user_input.phone, user_input.address, user_input.role_id, id], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error updating users'});
            console.log(sql);
            console.log(error);
        }else{
            res.send({code: 200, message: `Updated ${results.affectedRows} users`});
            console.log(sql);
        }
    })
})
router.post('/', (req, res) =>{
    let sql = `SELECT * FROM  users WHERE status = 1`;
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