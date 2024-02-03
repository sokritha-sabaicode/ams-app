const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");
const SessionModel = require("../models/Session.model");

const getSession = async (req, res, next) => {
  // TODO
  // 1. Check if event is exist
  // 2. check if session belong to the event
  // 3. Get Info session

  try {
    // Step 1
    const eventId = req.params.eid;
    const event = await EventModel.findById(eventId);
    console.log(event);

    if (!event) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        "This event is not exist"
      );
      return next(new Error(error));
    }

    // Step 2
    const sessionId = req.params.sid;

    console.log("sessionId", sessionId);
    console.log("event session", event.sessions);

    if (!event.sessions.includes(sessionId)) {
      const error = transferError(
        STATUS_CODE.BAD_REQUEST,
        "This session does not exist"
      );
      return next(new Error(error));
    }

    // Step 3
    const session = await SessionModel.findById(sessionId);

    httpResponse(res, STATUS_CODE.OK, "success", {
      session,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = getSession;
