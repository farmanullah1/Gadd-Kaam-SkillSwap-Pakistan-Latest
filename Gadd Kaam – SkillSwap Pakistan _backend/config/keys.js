// config/keys.js
require('dotenv').config(); // Load environment variables

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey', // Fallback for development, but use .env in production!
};