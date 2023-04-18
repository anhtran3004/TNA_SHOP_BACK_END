const express = require('express')
const db = require('./database')
const router = express.Router()
function formatDate(){
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
function generateSKU(name){
    const sku = name.replace(/\s+/g, "-");
    return sku;
}
router.post('/', (req, res) =>{
    const {filter, sort, pagination} = req.body;
    let sql = 'SELECT * FROM products WHERE status = 1 AND 1=1';

    // apply filters    
    if(filter){
        // if(filter.gender_type){
        //     sql += ` WHERE gender_type = '${filter.gender_type}'`
        // }
        if(filter.category_id && filter.category_id.length > 0){
            sql += ` AND category_id IN (${filter.category_id.join()})`;
        }
        if(filter.product_id && filter.product_id.length > 0){
            sql += ` AND id IN (${filter.product_id.join()})`;
        }
        if(filter.price){
            sql += ` AND price BETWEEN ${filter.price.min} AND ${filter.price.max}`;
            
        }
    }
    if(sort && sort.field && sort.order){
        sql += ` ORDER BY ${sort.field} ${sort.order}`;
    }
    const page = (pagination && pagination.page) ? pagination.page : 0;
    const perPage = (pagination && pagination.perPage) ? pagination.perPage : 10;
    const startIndex = page * perPage;
    sql += ` LIMIT ${startIndex}, ${perPage}`;
    console.log(sql);
    // console.log("sql", sql);
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
        }else{
            res.status(200).send({code: 200, message: "success!", data: results});
        }
    }) 
})
router.post('/insert-product', (req, res) =>{
    const {product_input} = req.body; 
    let sql = 'INSERT INTO products (name, price, sku, description, thumb, category_id, hot, discount_id, campain_id, import_date, update_date, priority) VALUES';
    if(product_input){
        sql+= ` ("${product_input.name}", ${product_input.price},"${generateSKU(product_input.name)}", "${product_input.description}", "${product_input.thumb}", ${product_input.category_id}, ${product_input.hot},
         ${product_input.discount_id}, ${product_input.campaign_id}, "${formatDate()}",  "${formatDate()}", ${product_input.priority})`;
    }
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!'})
        }
    }) 
})
router.put('/edit-product/:id', (req, res) => {
    const {product_input} = req.body;
    const id = req.params.id;
    const sql = `UPDATE products SET name = ?, sku = ?,  price = ?, description = ?, thumb = ?, category_id = ?, hot = ?, discount_id = ?, campain_id = ?, update_date = ?, priority = ? WHERE id = ?`;
    
    // execute query
    db.query(sql,[product_input.name,generateSKU(product_input.name), product_input.price, product_input.description, product_input.thumb, product_input.category_id, product_input.hot,
    product_input.discount_id, product_input.campain_id, new Date(), product_input.priority,
    id], (error,  results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating product' });
            console.log(sql);
            console.log("product name", product_input.description);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ error: `Product with ID ${id} not found` });
            console.log(sql);
        } else {
            res.send({ code: 200, message: `Product with ID ${id} updated successfully` });
            console.log(sql);
            console.log("product name", product_input.description);
            
        }
    }) 
})
router.put('/delete-product', (req, res) =>{
    const ids = req.body.ids; 
    if(!ids || !Array.isArray(ids)){
        res.status(400).send({code: 400, message:"Invalid request body"});
        // return
    }
    const sql = `UPDATE products SET status = 0 WHERE id IN (?)`; // sử dụng tham số IN để xóa nhiều sản phẩm
    db.query(sql, [ids], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting products'});
            console.log(sql);
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} products`});
        }
    })


})
router.post('/get-quantity-of-inventory/:id', (req, res) =>{
    const product_id = req.params.id;
    sql = `SELECT product_information.id, name, size, quantity, size_id, color_id, product_id FROM product_information join sizes on product_information.size_id = sizes.id join colors on colors.id = product_information.color_id where product_id = ${product_id}`
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get inventory products'});
        }else{
            res.send({code: 200, message: `Get ${results.affectedRows} products`, data: results});
        }

    })
})
router.post('/get-list-color/:id', (req, res) =>{
    const product_id = req.params.id;
    sql = `SELECT distinct colors.name FROM product_information join colors on colors.id = product_information.color_id where product_id = ${product_id}`
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get color  inventory'});
        }else{
            res.send({code: 200, message: `Get ${results.affectedRows} products`, data: results});
        }

    })
})
router.post('/get-list-size/:id/:name', (req, res) =>{
    const product_id = req.params.id;
    const color_name = req.params.name;
    sql = `SELECT product_information.id, name, size, quantity, size_id, color_id, product_id FROM sa.product_information join sa.sizes on product_information.size_id = sizes.id join sa.colors on colors.id = product_information.color_id where product_id = ${product_id} and name = "${color_name}"`
    console.log(sql);
    db.query(sql, (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error get color  inventory'});
        }else{
            res.send({code: 200, message: `Get ${results.affectedRows} products`, data: results});
        }

    })
})
router.post('/insert-quantity-of-inventory/:id', (req, res) =>{
    const product_id = req.params.id;
    const {product_input} = req.body; 
    let sql = 'INSERT INTO product_information (product_id, size_id, color_id, quantity) VALUES';
    if(product_input){
        sql+= ` (${product_id}, ${product_input.size_id}, ${product_input.color_id}, ${product_input.quantity})`;
    }
    console.log(sql);   
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!'})
        }
    }) 
})
router.put('/update-quantity-of-inventory/:id', (req, res) =>{
    const {product_input} = req.body;
    const product_id = req.params.id;
    const sql = `UPDATE product_information SET quantity = ? WHERE product_id = ? and size_id = ? and color_id = ?`;
    // execute query
    db.query(sql,[product_input.quantity,product_id ,product_input.size_id, product_input.color_id], (error,  results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating product' });
            console.log(sql);
            // console.log("product name", product_input.description);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ error: `Product with ID not found` });
            console.log(sql);
        } else {
            res.send({ code: 200, message: `Product with ID updated successfully` });
            console.log(sql);
            console.log("product name", product_input.description);
            
        }
    }) 
})
module.exports = router;