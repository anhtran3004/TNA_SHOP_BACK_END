const express = require('express')
const db = require('./database');
const { authenticate } = require('./jwt');
const router = express.Router()

router.post('/insert-favorite',authenticate('user'), (req, res)=>{
    const {product_id} = req.body;
    const user_ID = req.user.id;
    
    // let sql = `INSERT INTO favorites (user_id, product_id) VALUES`;
    // if(product_id){
    //     sql += `(${user_ID}, ${product_id})`;
    // }
    console.log(user_ID)
    let sql = `INSERT INTO favorites (user_id, product_id) 
             SELECT ${user_ID}, ${product_id}
             WHERE NOT EXISTS (
               SELECT 1 FROM favorites 
               WHERE user_id = ${user_ID} AND product_id = ${product_id}
             )`;
    console.log(sql);
    db.query(sql, (error, results) =>{
        if (error) {
            res.status(500).send({ code: 500, message: "Error inserting favorite" });
          } else {
            if (results.affectedRows === 0) {
              res.status(200).send({ code: 2000, message: "Product already exists in favorites" });
            } else {
              res.status(200).send({ code: 200, message: "Inserted favorite successfully" });
            }
          }
    })
});
router.post('/delete-favorite/:id',authenticate('user'), (req, res) =>{
    const id = req.params.id;
    let sql = `DELETE FROM favorites WHERE product_id=` + id
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting favorites'});
            console.log(sql);
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} favorites`});
            console.log(sql);
        }
    })
})
router.post('/',authenticate('user'), (req, res) =>{
    const user_ID = req.user.id;
    let sql = `SELECT * FROM favorites WHERE user_id=`+ user_ID;
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
module.exports = router;