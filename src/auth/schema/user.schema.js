const Joi = require("joi");

const UserRegisterSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("participant", "host").required(),
});

const UserLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  UserRegisterSchema,
  UserLoginSchema,
};
