// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Typically the auth header is of the format "Bearer <TOKEN>"
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY || 'your_very_secret_key');
        req.user = user;
      } catch (err) {
        console.error('Invalid/Expired token');
      }
    }
  }

  next();
};
