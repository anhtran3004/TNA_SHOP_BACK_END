const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const db = require('./database');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const refreshTokens = [];
// Sử dụng body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/login', (req, res) =>{
    //Authentication
    // const {username, password} = req.body;

    //Authorication
    const data = req.body;

    console.log("data", data);
    const accessToken = jwt.sign({data: data}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
    const refreshToken = jwt.sign({data: data}, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    // console.log(refreshTokens)
    // console.log(accessToken);
    res.json({accessToken, refreshToken});
    
})
app.post('/refreshToken', (req, res) =>{
    console.log("refreshTokens", refreshTokens)
    const refreshToken = req.body.refreshToken;
    console.log("refreshToken", refreshToken)
    if(!refreshToken) res.status(401).send("missing token");
    if(!refreshTokens.includes(refreshToken)) {
        res.status(403).send("error array");

    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        if(error)
            res.status(403).send({error: `${error} `})
            const accessToken = jwt.sign({data: data.username}, process.env.ACCESS_TOKEN_SECRET);      
        res.send({accessToken})
    })
})
app.listen(5000, () =>{
    console.log(`Server run port 5000...`);
})
