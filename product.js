const express = require('express')
const db = require('./database')
const { authenticates } = require('./jwt');
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
    const dbParams = [];

    // apply filters    
    if(filter){
        // if(filter.gender_type){
        //     sql += ` WHERE gender_type = '${filter.gender_type}'`
        // }
        if(filter.category_id && filter.category_id.length > 0){
            sql += ` AND category_id IN (${filter.category_id.join()})`;
        }
        if(filter.campaign_id && filter.campaign_id.length > 0){
            sql += ` AND campaign_id IN (${filter.campaign_id.join()})`;
        }
        if(filter.product_id && filter.product_id.length > 0){
            sql += ` AND id IN (${filter.product_id.join()})`;
        }
        if(filter.price){
            sql += ` AND price BETWEEN ${filter.price.min} AND ${filter.price.max}`;
            
        }
        if(filter.import_date){
            sql += ` AND import_date BETWEEN "${filter.import_date.min}" AND "${filter.import_date.max}"`;
            
        }
        // add search condition
        if(filter.search){
            const searchValue = `%${filter.search}%`;
            sql += ` AND (name LIKE ? OR description LIKE ?)`;
            dbParams.push(searchValue, searchValue);
        }
    }
    if(sort && sort.field && sort.order){
        sql += ` ORDER BY ${sort.field} ${sort.order}`;
    }
    const page = (pagination && pagination.page) ? pagination.page : 0;
    const perPage = (pagination && pagination.perPage) ? pagination.perPage : 10000;
    const startIndex = page * perPage;
    sql += ` LIMIT ${startIndex}, ${perPage}`;
    db.query(sql,dbParams, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
            console.log(sql);
        }else{
            res.status(200).send({code: 200, message: "success!", data: results});
            console.log(sql);
        }
    }) 
})
router.post('/insert-product' , authenticates(['admin', 'employee']), (req, res) =>{
    const {product_input} = req.body; 
    let sql = 'INSERT INTO products (name, price, sku, description, thumb, category_id, hot, discount_id, campaign_id, import_date, update_date, priority) VALUES';
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
            res.status(200).send({code: 200, message:'success!',data: results})
        }
    }) 
})
router.put('/edit-product/:id' , authenticates(['admin', 'employee']), (req, res) => {
    const {product_input} = req.body;
    const id = req.params.id;
    const sql = `UPDATE products SET name = ?, sku = ?,  price = ?, description = ?, thumb = ?, category_id = ?, hot = ?, discount_id = ?, campaign_id = ?, update_date = ?, priority = ? WHERE id = ?`;
    
    // execute query
    db.query(sql,[product_input.name,generateSKU(product_input.name), product_input.price, product_input.description, product_input.thumb, product_input.category_id, product_input.hot,
    product_input.discount_id, product_input.campaign_id, formatDate(), product_input.priority,
    id], (error,  results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating product' });
            console.log(sql);
            // console.log("product name", product_input.description);
        } else if (results.affectedRows === 0) {
            res.status(404).send({ error: `Product with ID ${id} not found` });
            console.log(sql);
        } else {
            res.send({ code: 200, message: `Product with ID ${id} updated successfully` });
            console.log(sql);
            // console.log("product name", product_input.description);
            
        }
    }) 
})
router.put('/delete-product' , authenticates(['admin', 'employee']), (req, res) =>{
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
router.put('/delete-product-follow-category/:id' , authenticates(['admin', 'employee']), (req, res) =>{
    const id = req.params.id;
    const status = req.body.status;
    const sql = `UPDATE products SET status = ? WHERE category_id = (?)`; // sử dụng tham số IN để xóa nhiều sản phẩm
    db.query(sql, [status,id], (error, results) => {
        if(error){
            res.status(500).send({code: 500, message:'Error deleting products'});
            console.log(sql);
        }else{
            res.send({code: 200, message: `Deleted ${results.affectedRows} products`});
        }
    })


})
router.post('/get-quantity-of-inventory/:id' , authenticates(['admin', 'employee']), (req, res) =>{
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
router.post('/get-quantity/:id', (req, res) =>{
    const product_id = req.params.id;
    const {product_input} = req.body; 
    let sql = 'SELECT quantity FROM product_information join sizes on product_information.size_id = sizes.id join colors on colors.id = product_information.color_id where product_id = ? and name = ? and size = ?';
   
    console.log(sql);   
    // execute query
    db.query(sql,[product_id, product_input.color_name, product_input.size], (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
        }else{
            // res.send(results);
            res.status(200).send({code: 200, message:'success!', data: results})
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
router.put('/update-quantity-order/:id', (req, res) =>{
    const {product_input} = req.body;
    const product_id = req.params.id;
    const sql = `UPDATE product_information join sizes on product_information.size_id = sizes.id join colors on colors.id = product_information.color_id SET quantity = ? WHERE product_id = ? and name = ? and size = ?`;
    // execute query
    db.query(sql,[product_input.quantity,product_id ,product_input.color_name, product_input.size], (error,  results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating product' });
            console.log(sql);
            // console.log("product name", product_input.description);
        }
        else {
            res.send({ code: 200, message: `Product with ID updated successfully` });
            console.log(sql);
            // console.log("product name", product_input.description);
            
        }
    }) 
})
module.exports = router;