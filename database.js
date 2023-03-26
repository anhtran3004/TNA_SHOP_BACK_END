const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456a@',
  database: 'sa'
});

connection.connect((error) => {
  if (error) {
    console.log('Error connecting to MySQL database', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = connection;