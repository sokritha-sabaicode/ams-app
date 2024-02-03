const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
