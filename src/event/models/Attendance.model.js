const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  enteredAt: Date,
  leftAt: Date,
  entryStatus: { type: String, enum: ["EARLY", "LATE"] },
  leaveStatus: { type: String, enum: ["ON_TIME", "LEFT_EARLY"] },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
