const mongoose = require("mongoose");
const config = require("../config");

const dbconnect = () => {
  mongoose
    .connect(config.MONGO_URL)
    .then(() => {
      console.log("MONGO DB is connected");
    })
    .catch((err) => {
      console.log("DB connected failed: ", err);
    });
};

module.exports = dbconnect;
