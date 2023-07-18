const Joi = require('joi');

const UsersPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { UsersPayloadSchema };
