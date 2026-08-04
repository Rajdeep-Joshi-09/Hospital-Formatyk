const { sendError } = require('../utils/responseHandler');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(', ');
      return sendError(res, message, 422, details);
    }
  };
};

module.exports = {
  validate,
};
