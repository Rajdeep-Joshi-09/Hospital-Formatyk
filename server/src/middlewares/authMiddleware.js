const { sendError } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return sendError(res, 'Authentication token required', 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', 403);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
