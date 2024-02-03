const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const AttendanceModel = require("../models/Attendance.model");
const EventModel = require("../models/Event.model");
const SessionModel = require("../models/Session.model");

module.exports = async (req, res, next) => {
  // TODO
  // 1. Check if the session exist
  // 2. Check if the host own that session
  // 2.1. Get user info
  // 2.2. Get event info
  // 2.3. Check if the session is in the event
  // 2.4. validate owner
  // 3. Get Detail info of the session

  try {
    // Step 1
    const sessionId = req.params.sid;
    const session = await SessionModel.findById(sessionId);

    if (!session) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `This session does not exist`
      );
      return next(new Error(error));
    }

    // Step 2
    const userId = req.userId;
    const user = await getUserDetailFromDBByUID(userId);

    const eventId = req.params.eid;
    const event = await EventModel.findById(eventId);

    if (!event) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `This event does not exist`
      );
      return next(new Error(error));
    }
    console.log(event.sessions);

    if (!event.sessions.includes(sessionId)) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `This session does not exist`
      );
      return next(new Error(error));
    }

    if (event.host.toString() !== user._id.toString()) {
      const error = transferError(STATUS_CODE.NOT_AUTHORIZED, `Not Authorized`);
      return next(new Error(error));
    }

    // Step 3
    const attendance = await AttendanceModel.find({ sessionId });

    const summary = {
      earlyArrivals: 0,
      lateArrivals: 0,
      onTimeDepartures: 0,
      earlyDepartures: 0,
    };

    attendance.forEach((record) => {
      if (record.entryStatus === "EARLY") summary.earlyArrivals += 1;
      if (record.entryStatus === "LATE") summary.lateArrivals += 1;
      if (record.leaveStatus === "ON_TIME") summary.onTimeDepartures += 1;
      if (record.leaveStatus === "LEFT_EARLY") summary.earlyDepartures += 1;
    });
    httpResponse(res, STATUS_CODE.OK, "success", {
      summary,
    });
  } catch (err) {
    return next(new Error(err));
  }
};
