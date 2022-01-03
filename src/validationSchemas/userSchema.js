const Joi = require('joi');

const entrySchema = Joi.object({
  username: Joi
    .string()
    .required()
    .min(3)
    .max(50)
    .messages({
      'any.required': '[username] is required',
      'string.empty': '[username] is required',
      'string.min': '[username] should be between 3 and 50 characters',
      'string.max': '[username] should be between 3 and 50 characters'
    }),

  email: Joi
    .string()
    .required()
    .pattern(new RegExp('^(.+)@(\\S+)$'))
    .messages({
      'any.required': '[email] is required',
      'string.empty': '[email] is required',
      'string.pattern.base': '[email] format is invalid'
    }),

  password: Joi
    .string()
    .required()
    .max(50)
    .messages({
      'any.required': '[password] is required',
      'string.empty': '[password] is required',
      'string.max': '[password] should be 50 characters max'
    })
});

module.exports = entrySchema;