const bcrypt = require('bcrypt');
const db = require('./database')

function createUser(username, email, password, fullname, phone, address, created_date, role_id) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      db.query(
        'INSERT INTO users (username, email, password, name, phone, address, created_date, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [username,email, hashedPassword, fullname, phone, address, created_date, role_id],
        (error, results, fields) => {
          if (error) return reject(error);
          return resolve({code: 200, message:"insert size sucess", data: results});
        }
      );
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [email],
      (error, results, fields) => {
        if (error) return reject(error);
        if (results.length === 0) return resolve(null);
        resolve(results[0]);
      }
    );
  });
}

function comparePasswords(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  comparePasswords
};