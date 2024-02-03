const express = require("express");
const registerUser = require("./controllers/registerUser");
const loginUser = require("./controllers/loginUser");
const { isAuthenticated, requireRole } = require("../../middleware/auth");
const validateInput = require("../../middleware/validateInput");
const { UserRegisterSchema, UserLoginSchema } = require("./schema/user.schema");

const router = express.Router();

// Sub Routes
router.post("/register", validateInput(UserRegisterSchema), registerUser);
router.post("/login", validateInput(UserLoginSchema), loginUser);

// User
router.patch(
  "/user",
  isAuthenticated,
  requireRole(["host", "participant"]),
  (req, res, next) => {
    res.send("update user");
  }
);

module.exports = router;
