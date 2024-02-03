const { STATUS_CODE } = require("../../../utils/const");
const admin = require("../../../utils/firebase");
const { httpResponse } = require("../../../utils/response");
const UserModel = require("../models/User.model");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // TODO
    // 1. Save User to Firebase
    // 2. Generate token
    // 3. Save new user to DB

    // STEP 1
    const userCredential = await admin
      .auth()
      .createUser({ email, password, displayName: username });

    // STEP 2
    const token = await admin.auth().createCustomToken(userCredential.uid);

    // STEP 3
    const newUser = await UserModel.create({
      userId: userCredential.uid,
      username: userCredential.displayName,
      email: userCredential.email,
      role: role,
    });

    httpResponse(res, STATUS_CODE.CREATED, "success", {
      newUser,
      token,
    });
  } catch (err) {
    return next(new Error(err))
  }
};

module.exports = registerUser;
