const httpResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    status: message,
    data,
  });
};

module.exports = {
  httpResponse,
};
