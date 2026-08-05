const Joi = require('joi');

const userTypeSchema = Joi.object({
  userType: Joi.string().required().messages({
    'string.empty': 'User type name is required',
    'any.required': 'User type name is required'
  }),
  isStatus: Joi.number().valid(0, 1).optional()
});

module.exports = {
  userTypeSchema
};
