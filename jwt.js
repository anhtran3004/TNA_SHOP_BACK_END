const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function authenticate(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Authorization header missing');
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).send('Invalid token');
      console.log(decoded);
      if (role && decoded.role !== role) return res.status(403).send('Forbidden');
      req.user = decoded;
      next();
    });
  };
}

module.exports = {
  authenticate
};