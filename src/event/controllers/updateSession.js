const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");
const SessionModel = require("../models/Session.model");

const updateSession = async (req, res, next) => {
  // TODO
  // 1. Check if event is exist
  // 2. Check if Session is exist
  // 3. Check if host own the event
  // 4. Update session

  try {
    // Step 1
    const eventId = req.params.eid;
    const event = await EventModel.findById(eventId);

    if (!event) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        "This event is not exist"
      );
      return next(new Error(error));
    }

    // Step 2
    const sessionId = req.params.sid;
    if (!event.sessions.includes(sessionId)) {
      const error = transferError(
        STATUS_CODE.BAD_REQUEST,
        "This session does not exist"
      );
      return next(new Error(error));
    }

    // Step 3
    const userId = req.userId;
    const user = await getUserDetailFromDBByUID(userId);

    if (user._id.toString() !== event.host.toString()) {
      const error = transferError(
        STATUS_CODE.NOT_AUTHORIZED,
        "Cannot edit this sesssion"
      );
      return next(new Error(error));
    }

    // Step 4
    const updateSession = await SessionModel.findByIdAndUpdate(
      sessionId,
      { ...req.body },
      { new: true }
    );

    httpResponse(res, STATUS_CODE.OK, "success", {
      session: updateSession,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = updateSession;
