const express = require("express");
const { httpResponse } = require("./utils/response");
const { STATUS_CODE } = require("./utils/const");
const { transferError } = require("./utils/error");
const authRouter = require("./src/auth/route");
const eventRouter = require("./src/event/route");

const app = express();

// Global Middleware
app.use(express.json());

// Global Route
app.use("/", authRouter);
app.use("/events", eventRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.log("Error: ", err);

  const statusCode = err.statusCode || STATUS_CODE.INTERNAL_ERROR;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    status: "fail",
    message,
  });
});

module.exports = app;
