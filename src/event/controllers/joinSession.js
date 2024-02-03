const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const AttendanceModel = require("../models/Attendance.model");
const SessionModel = require("../models/Session.model");

module.exports = async (req, res, next) => {
  // TODO
  // 1. Check if the session exist
  // 2. Check if the code belong to the session
  // 3. Check if the user has been scan the qrcode yet (if no, create record in attendance)
  // 4. If the user has been scan the qrcode before (means that they scan for leaving)

  try {
    // Step 1
    const sessionId = req.params.sid;
    const session = await SessionModel.findById(sessionId);
    if (!session) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `This session does not found`
      );
      return next(new Error(error));
    }

    // Step 2
    const code = req.query.code;
    if (session.code !== code) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `This code is not correct`
      );
      return next(new Error(error));
    }

    // Step 3
    const userId = req.userId;
    const user = await getUserDetailFromDBByUID(userId);

    const attendance = await AttendanceModel.findOne({
      sessionId,
      userId: user._id,
    });
    const currentTime = new Date();

    if (attendance) {
      if (!attendance.leftAt) {
        // User's second scan - record exist
        attendance.leftAt = currentTime;
        attendance.leaveStatus =
          currentTime <= session.endTime ? "LEFT_EARLY" : "ON_TIME";

        await attendance.save();
        httpResponse(res, STATUS_CODE.OK, "success", {
          message: `Exit recorded successfully. You left at ${currentTime}`,
        });
      } else {
        // User has already scanned both entry and exit
        const error = transferError(
          STATUS_CODE.BAD_REQUEST,
          "You have already completed both entry and exit scans."
        );
        return next(new Error(error));
      }
    } else {
      // Scan for the first time
      const newAttendance = new AttendanceModel({
        sessionId,
        userId: user._id,
        enteredAt: currentTime,
        entryStatus: currentTime <= session.startTime ? "EARLY" : "LATE",
      });
      await newAttendance.save();

      httpResponse(res, STATUS_CODE.CREATED, "success", {
        message: `Entry recorded successfully. You arrived at ${currentTime}`,
      });
    }
  } catch (err) {
    return next(new Error(err));
  }
};
