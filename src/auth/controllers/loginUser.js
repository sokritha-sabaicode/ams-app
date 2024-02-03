const { FIREBASE_API_KEY } = require("../../../config");
const axios = require("axios");
const admin = require("../../../utils/firebase");
const { httpResponse } = require("../../../utils/response");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");

const loginUser = async (req, res, next) => {
  // TODO
  // 1. Send Email, Password to Firebase
  // 2. Generate token to client

  try {
    const { email, password } = req.body;

    // Step 1
    const VERIFY_PASSWORD_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

    const response = await axios.post(VERIFY_PASSWORD_ENDPOINT, {
      email,
      password,
    });

    // Step 2
    if (response.status === 200) {
      const userId = response.data.localId;

      const token = await admin.auth().createCustomToken(userId);

      httpResponse(res, STATUS_CODE.OK, "success", {
        message: "Signin Successful!",
        token,
      });
    }
  } catch (error) {
    if (error.response.status === 400) {
      const err = transferError(
        STATUS_CODE.NOT_AUTHORIZED,
        "Email and Password is not correct"
      );
      return next(new Error(err));
    }
    return next(new Error(error));
  }
};

module.exports = loginUser;
