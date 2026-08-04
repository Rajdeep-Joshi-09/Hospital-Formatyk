/**
 * Standardizes API responses
 * @param {Object} res - Express response object
 * @param {string} message - Descriptive message
 * @param {Object|Array} [result={}] - Data payload
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, message, result = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: true,
    message,
    result,
  });
};

/**
 * Standardizes API error responses
 * @param {Object} res - Express response object
 * @param {string} message - Error description
 * @param {number} [statusCode=500] - HTTP error code
 * @param {Object|Array} [result={}] - Additional error details
 */
const sendError = (res, message, statusCode = 500, result = {}) => {
  return res.status(statusCode).json({
    status: false,
    message,
    result,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
