const express = require('express')
const db = require('./database')
const router = express.Router()
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const otp = require('otplib');
const moment = require('moment');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Tạo mã OTP với speakeasy
// function generateOTP(){
//     const serect = speakeasy.generateSecret({length: 20});
//     const token = speakeasy.totp({
//             serect: serect.base32,
//             encoding: 'base32',
//     })
//     return {serect: serect.base32, token};
// }
//Lưu trữ mã OTP và email
// const otpStore = {};
//Gửi eamil chứa mã OTP
async function sendOTP(email, otp){
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tranngocanh2192001@gmail.com',
                pass: 'jiajtpkvhxcbfvhd',
                
               
            },
        });
        const mailOptions = {
            from: 'tranngocanh2192001@gmail.com',
            to: email,
            subject: 'OTP for password reset',
            text: `Your OTP for password reset is ${otp}, Please enter code this code on the password reset page withing 5 minutes`,
        };
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              console.log('Failed to send OTP code');
            } else {
              console.log('Email sent: ' + info.response);
              console.log('OTP code sent');
            }
          });
    }catch(err){
        console.log(err);
        throw new Error('Error sending email');
    }
}
// get user by email
const getUserByEmail = (email) => {
    const rows = db.query('SELECT * FROM users WHERE email = ?', [ email]);
    return rows;
};
const updateUserOTP = (email, secret, code, expiresAt) => {
    db.query('UPDATE users SET otp_secret = ?, otp_code = ?, otp_expires_at = ? WHERE email = ?', [secret, code, expiresAt, email]);
};
const updateUserPassword = async (userId, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
};
const clearUserOTP = (email) => {
    db.query('UPDATE users SET otp_secret = NULL, otp_code = NULL, otp_expires_at = NULL WHERE email = ?', [email]);
};
    
// Xử lý yêu cầu quên mật khẩu và gửi mã OTP
router.post('/', async (req, res) =>{
    const {email} = req.body;
    const user =  getUserByEmail(email);
    if(!email){
        return res.status(400).json({error: 'Email is required'});
    }
    if(!user){
        return res.status(404).json({error: 'User not found'});
    }
    //Tạo và lưu trữ OTP
    // const otp = generateOTP();
    // otpStore[email] = otp;
    const serect = otp.authenticator.generateSecret();
    const code = otp.authenticator.generate(serect);
    const expiresAt = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    updateUserOTP(email,serect, code, expiresAt);
    await sendOTP(email, code);
    //Gửi email chứa mã OTP
    try{
        res.status(200).json({code:200, message: 'OTP sent successfully'})
    }catch(err){
        console.log(err);
        res.status(500).json({code: 200, error: 'Email dending OTP'});
    }
});

router.post('/verify-otp', (req, res) =>{
    const {code, email} = req.body;
    // const user =  getUserByEmail(email);
    const user =  db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error verify otp'});
            console.log(sql);
            console.log(error);
        }else if(results.affectedRows === 0){
            res.status(404).send('User not found');
        }
        else{
            const isExpiredOTP = moment().isAfter(results[0].otp_expires_at);
            console.log(isExpiredOTP);
            console.log(results[0].otp_code);
            console.log(code);
            if((results[0].otp_code !== code) || isExpiredOTP){
                return res.status(400).send('Invalid or expired OTP code');
            }
            res.status(200).send({code: 200, message:"verify otp success!"});
        }
        
    });
})
router.post('/reset-password', async (req, res) =>{
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let sql = `UPDATE users SET password = ? WHERE email = ?`;
    db.query(sql,[hashedPassword, email] , (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error updating users'});
            console.log(sql);
            console.log(error);
        }else{
            res.send({code: 200, message: `Updated ${results.affectedRows} users`});
            console.log(sql);
            clearUserOTP(email);
        }
    })
    
    // res.send('Password reset successfully');
})
module.exports = router;