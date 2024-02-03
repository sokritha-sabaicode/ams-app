const Joi = require("joi");

const sessionCreationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null),
  startTime: Joi.date().required(),
  endTime: Joi.date().required().greater(Joi.ref("startTime")),
});

module.exports = {
  sessionCreationSchema,
};
