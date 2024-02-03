const { STATUS_CODE } = require("../utils/const");
const { transferError } = require("../utils/error");

const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const err = transferError(
        STATUS_CODE.BAD_REQUEST,
        error.details[0].message
      );
      return next(new Error(err));
    }
    next();
  };
};

module.exports = validateInput;
