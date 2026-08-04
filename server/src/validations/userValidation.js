const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(10).max(20),
  password: Joi.string().required().min(6),
  userType: Joi.number().integer().required(),
  isStatus: Joi.number().integer().valid(0, 1).optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(10).max(20).optional(),
  password: Joi.string().min(6).optional(),
  userType: Joi.number().integer().optional(),
  isStatus: Joi.number().integer().valid(0, 1).optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
