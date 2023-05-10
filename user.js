const express = require('express')
const db = require('./database')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const formatDate = require('./formatDate');
const dotenv = require('dotenv').config();
const {authenticate} = require('./jwt')
const { createUser, getUserByUsername,
    getUserByUsernameRoleAdmin, comparePasswords } = require('./modelUser');
// async function HashedPassword(password){
//     const hashedPassword = await bcrypt.hash(password, 10);
//     return hashedPassword;
// }
router.post('/insert-user',async (req, res)=>{
    const {user_input} = req.body;
    
        const result = await createUser(user_input.username, user_input.email, user_input.password, user_input.name, user_input.phone, user_input.address, formatDate(), 'user');
        console.log('result', result);
        res.status(200).send({code: 200, message:"insert size sucess", data: result});
});
router.post('/insert-user-by-admin',authenticate('admin'), async (req, res)=>{
    const {user_input} = req.body;
        const result = await createUser(user_input.username, user_input.email, user_input.password, user_input.name, user_input.phone, user_input.address, formatDate(), user_input.role);
        console.log('result', result);
        res.status(200).send({code: 200, message:"insert size sucess", data: result});
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send('Invalid email or password');
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid email or password');
    console.log("user", user);
    
    const token = jwt.sign({ id: user.id, user: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign({id: user.id, user: user.username, role: user.role}, process.env.REFRESH_TOKEN_SECRET);
    
    //Lưu refresh token vào cơ sở dữ liệu để sử dụng cho việc cập nhật access oekn
    const insertQuery = `INSERT INTO refresh_tokens (user_id, token) VALUES (${user.id}, '${refreshToken}')`;
    db.query(insertQuery, (error, results, fields) => {
        if (error) throw error;
    })
    res.status(200).send({code: 200, message:"Login succcess",data: {accessToken: token, refreshToken: refreshToken} });
  });
  router.post('/login-admin', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameRoleAdmin(username);
    if (!user) return res.status(401).send('Invalid email or password');
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid email or password');
    console.log("user", user);
    
    const token = jwt.sign({ id: user.id, user: user.username, role: user.role}, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign({id: user.id, user: user.username, role: user.role}, process.env.REFRESH_TOKEN_SECRET);
    
    //Lưu refresh token vào cơ sở dữ liệu để sử dụng cho việc cập nhật access oekn
    const insertQuery = `INSERT INTO refresh_tokens (user_id, token) VALUES (${user.id}, '${refreshToken}')`;
    db.query(insertQuery, (error, results, fields) => {
        if (error) throw error;
    })
    res.status(200).send({code: 200, message:"Login succcess",data: {accessToken: token, refreshToken: refreshToken} });
  });
router.post('/refreshToken', (req, res) =>{
    const refreshToken = req.body.refreshToken;
    console.log("refreshToken", refreshToken)
    if(!refreshToken) res.status(401).send("missing token");
    // Kiểm tra xem refresh token có hợp lệ không
    const query = `SELECT * FROM refresh_tokens WHERE token = '${refreshToken}'`;
    db.query(query, (error, results, fields) => {
        if (error) throw error;
    })
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error)
            res.status(403).send({error: `${error} `})
            const accessToken = jwt.sign({data: data.username}, process.env.ACCESS_TOKEN_SECRET);      
        res.send({accessToken: accessToken})
    })
})
router.post('/delete-user' , authenticate('admin'), (req, res) =>{
    const ids = req.body.ids;
    const status = req.body.status;
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        return
    }
    let sql = `UPDATE users SET status = ? WHERE id IN (?)`
    db.query(sql, [ status,ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting users'});
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} users`});
            console.log(sql);
        }
    })
})
router.put('/update-user/:id', (req, res) =>{
    const {user_input} = req.body;
    const id = req.params.id;
    // const password = hashedPassword(user_input.password)
    let sql = `UPDATE users SET email = ?, name = ?, phone = ?, address = ?,birth_date = ? WHERE id = ?`
    db.query(sql, [user_input.email, user_input.name, user_input.phone, user_input.address,user_input.birth_date, id], (error, results) => {
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
router.post('/update-user-by-admin/:id',authenticate('admin'), (req, res) =>{
    const {user_input} = req.body;
    const id = req.params.id;
    // const password = hashedPassword(user_input.password)
    let sql = `UPDATE users SET email = ?, username = ?, name = ?, phone = ?, address = ?, role = ? WHERE id = ?`
    db.query(sql, [user_input.email,user_input.username, user_input.name, user_input.phone, user_input.address, user_input.role, id], (error, results) => {
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
router.post('/', authenticate('admin'), (req, res) =>{
    const {filter, sort} = req.body;
    const dbParams = [];
    let sql = `SELECT * FROM users WHERE 1=1 `;
    if(filter){
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (name LIKE ? OR username LIKE ? OR email LIKE ? OR phone LIKE ?)`;
            dbParams.push(searchValue, searchValue, searchValue, searchValue);
        }
        if(filter.created_date){
            sql += ` AND created_date BETWEEN "${filter.created_date.min}" AND "${filter.created_date.max}"`;
            
        }
        if(sort && sort.field && sort.order){
            sql += ` ORDER BY ${sort.field} ${sort.order}`;
        }
    }
    db.query(sql,dbParams, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get sizes'});
            console.log(sql);
        }else{
            res.send({code: 200, message: `Get sizes sucess`, data: results} );
            console.log(sql);
        }
    })
})

router.post('/get-user/:id', (req, res) =>{
    const id = req.params.id;
    let sql = `SELECT * FROM  users WHERE status = 1 and id=`+ id;
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
router.post('/get-username', (req, res) =>{
    let sql = `SELECT username, email FROM  users`;
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