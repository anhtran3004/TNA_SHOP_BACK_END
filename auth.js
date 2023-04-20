const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./database');
const dotenv = require('dotenv').config();
const router = express.Router();

router.post('/get-user',authenToken, (req, res) =>{
    res.send({message:"get user success!" })
})
router.post('/login', (req, res) =>{
    //Authentication
    const {username, password} = req.body;
    
    //Authorication
    const data = req.body;

    console.log("data", data);
    const accessToken = jwt.sign({data: data}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
    // const refreshToken = jwt.sign({data: data}, process.env.REFRESH_TOKEN_SECRET);
    // refreshTokens.push(refreshToken);
    // console.log(refreshTokens)
    // console.log(accessToken);
    res.json({accessToken});
    
})
function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    //'Beaer [token]'
    const token = authorizationHeader.split(' ')[1];
    if(!token) res.status(401).send({error: "missing authenrization token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error){
            res.status(403).send({error: `${error} `})
        }else{
        
            next()
        }
    })
    
}

module.exports = router;