
const express = require('express');
const db = require('./database');
const product = require('./product');
const learn = require('./learn')
const app = express();
app.use(express.json());
app.use('/api/v1/product', product);
app.use('/api/v1/learn',learn );
// PORT server
const port = process.env.PORT || 3000;
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.log('Error fetching users from MySQL database', error);
        res.status(500).json({ error: 'Error fetching users from MySQL database' });
      } else {
        res.json(results);
      }
    });
  });
  
  app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (last_name, email) VALUES (?, ?)', [name, email], (error, results) => {
      if (error) {
        console.log('Error inserting user into MySQL database', error);
        res.status(500).json({ error: 'Error inserting user into MySQL database' });
      } else {
        res.json({ id: results.insertId, name, email });
      }
    });
  });
app.listen(port, () =>{
    console.log(`Server run port ${port}...`);
})

