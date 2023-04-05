const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./database');
const dotenv = require('dotenv').config();
const router = express.Router();

router.post('/login', (req, res) =>{
    //Authentication
    // const {username, password} = req.body;

    //Authorication
    const data = req.body.username;
    const accessToken = jwt.sign({data: data}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    console.log(accessToken);
    res.json({accessToken});
    
})
router.post('/get-user',authenToken, (req, res) =>{
    res.send({message:"get user success!"})
})
function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    //'Beaer [token]'
    const token = authorizationHeader.split(' ')[1];
    if(!token) res.status(401).send({error: "missing authenrization token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error){
            res.send({error: `${error} `})
        }else{
            next()
        }
    })
    
}

module.exports = router;