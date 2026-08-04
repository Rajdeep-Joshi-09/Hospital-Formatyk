const Joi = require('joi');

const createMenuSchema = Joi.object({
  menuName: Joi.string().required().min(2).max(100),
  pageName: Joi.string().allow('', null).optional(),
  formPageRoute: Joi.string().allow('', null).optional(),
  listPageRoute: Joi.string().allow('', null).optional(),
  sortOrder: Joi.number().integer().optional(),
  icon: Joi.string().allow('', null).optional(),
  parentId: Joi.number().integer().allow(null).optional(),
  isStatus: Joi.number().integer().valid(0, 1).optional(),
});

const updateMenuSchema = Joi.object({
  menuName: Joi.string().min(2).max(100).optional(),
  pageName: Joi.string().allow('', null).optional(),
  formPageRoute: Joi.string().allow('', null).optional(),
  listPageRoute: Joi.string().allow('', null).optional(),
  sortOrder: Joi.number().integer().optional(),
  icon: Joi.string().allow('', null).optional(),
  parentId: Joi.number().integer().allow(null).optional(),
  isStatus: Joi.number().integer().valid(0, 1).optional(),
});

module.exports = {
  createMenuSchema,
  updateMenuSchema,
};
