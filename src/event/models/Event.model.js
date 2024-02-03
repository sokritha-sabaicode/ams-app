const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String, // Class, Conference, Meeting
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
