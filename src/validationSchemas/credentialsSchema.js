const Joi = require('joi');

const credentialsSchema = Joi.object({
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

module.exports = credentialsSchema;