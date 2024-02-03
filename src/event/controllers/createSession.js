const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { generateCode } = require("../../../utils/code");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");
const SessionModel = require("../models/Session.model");
const QRCode = require("qrcode");

const createSession = async (req, res, next) => {
  // TODO
  // 1. Check if event exist
  // 2. Check if user own that event
  // 3. Generate QRCode for the session
  // 4. Create Session
  // 5. Find the event & add session to event
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
    const userId = req.userId;
    const host = await getUserDetailFromDBByUID(userId);

    if (!host) {
      const error = transferError(STATUS_CODE.NOT_FOUND, "User is not exist");
      return next(new Error(error));
    }

    console.log("event host", event.host);
    console.log("host id", host._id);

    if (event.host.toString() !== host._id.toString()) {
      const error = transferError(
        STATUS_CODE.NOT_AUTHORIZED,
        "You are not authorized to create session for this event"
      );
      return next(new Error(error));
    }

    // Step 3 / 4
    const sessionCode = generateCode();
    const newSession = new SessionModel({
      code: sessionCode,
      eventId,
      ...req.body,
    });
    const result = await newSession.save();

    const qrCodeData = `http://localhost:8000/events/${eventId}/sessions/${result._id}/join-session?code=${sessionCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Step 5
    event.sessions.push(result._id);
    await event.save();

    // Send Result to Client
    httpResponse(res, STATUS_CODE.CREATED, "success", {
      ...result._doc,
      qrCode: qrCodeImage,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = createSession;
