const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const USER_TYPE = {
  HOST: "host",
  PARTICIPANT: "participant",
};

module.exports = {
  STATUS_CODE,
  USER_TYPE,
};
