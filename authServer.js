const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./database');
const dotenv = require('dotenv').config();
const app = express();
const refreshTokens = []
app.post('/login', (req, res) =>{
    //Authentication
    // const {username, password} = req.body;

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
app.post('/refreshToken', (req, res) =>{
    console.log("refreshTokens", refreshTokens)
    const refreshToken = req.body;
    console.log("refreshToken", refreshToken)
    if(!refreshToken) res.status(401).send("missing token");
    if(!refreshTokens.includes(refreshToken)) {
        res.status(403).send("error array");

    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error)
            res.status(403).send({error: `${error} `})
            const accessToken = jwt.sign({username: data.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});      
        res.send({accessToken})
    })
})
app.listen(5000, () =>{
    console.log(`Server run port 5000...`);
})
