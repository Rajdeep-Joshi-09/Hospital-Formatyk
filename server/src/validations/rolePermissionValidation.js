const Joi = require('joi');

const rolePermissionSchema = Joi.object({
  userTypeId: Joi.number().required().messages({
    'number.base': 'User Type ID must be a number',
    'any.required': 'User Type ID is required'
  }),
  permissions: Joi.array().items(
    Joi.object({
      menuId: Joi.number().required(),
      isRead: Joi.number().valid(0, 1).required(),
      isWrite: Joi.number().valid(0, 1).required(),
      isEdit: Joi.number().valid(0, 1).required(),
      isDelete: Joi.number().valid(0, 1).required(),
    })
  ).required()
});

module.exports = {
  rolePermissionSchema
};
