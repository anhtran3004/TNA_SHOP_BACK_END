const express = require('express')
const db = require('./database')
const router = express.Router()
router.post('/', (req, res) =>{
    const {filter, sort, pagination} = req.body;
    let sql = 'SELECT * FROM products WHERE 1=1';

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
    console.log("sql", sql);
    // execute query
    db.query(sql, (error,  results) => {
        if(error){
            res.status(500).send({error: 'Error fetching products form database'});
        }else{
            res.send(results);
        }
    }) 
})
router.post('/insert-product', (req, res) =>{
    const {product_input} = req.body; 
    let sql = 'INSERT INTO products (name, price, description, thumb, category_id, status, hot, campain_id, discount_id, quantiy_of_inventory, start_import) VALUES';
    if(product_input){
        sql+= ` ("${product_input.name}", ${product_input.price}, "${product_input.desc}", "${product_input.thumb}", ${product_input.category_id}, ${product_input.status}, ${product_input.hot},
        ${product_input.campain_id}, ${product_input.discount_id}, ${product_input.quantity_of_inventory}, "${product_input.start_import}")`;
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
router.post('edit-product', (req, res) =>{
    const {product_input} = req.body; 
})
router.put()
module.exports = router;