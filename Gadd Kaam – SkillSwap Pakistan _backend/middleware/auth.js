// middleware/auth.js
const jwt = require('jsonwebtoken');
const keys = require('../config/keys'); // Import your keys

const auth = (req, res, next) => {
  // Get token from the 'Authorization' header
  const authHeader = req.header('Authorization');

  // Check if header exists and is in the correct format (Bearer <token>)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token from the header (e.g., 'Bearer <token>' -> '<token>')
  const token = authHeader.split(' ')[1];

  // Verify token
  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;