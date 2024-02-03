const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { generateCode } = require("../../../utils/code");
const { STATUS_CODE } = require("../../../utils/const");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");
const QRCode = require("qrcode");

const createEvent = async (req, res, next) => {
  // TODO
  // 1. Get the user id from request
  // 2. Get the user detail from DB
  // 3. Generate Code for the event
  // 4. Save the event to DB
  // 5. Convert Code to QRCode

  try {
    // Step 1
    const userId = req.userId;

    // Step 2
    const host = await getUserDetailFromDBByUID(userId);

    // Step 3
    const eventCode = generateCode();

    // Step 4
    const newEvent = new EventModel({
      ...req.body,
      host: host._id,
      code: eventCode,
    });

    const result = await newEvent.save();

    // Step 5
    const qrCodeData = `http://localhost:8000/events/${result._id}/join-event?code=${eventCode}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    httpResponse(res, STATUS_CODE.CREATED, "success", {
      ...result._doc,
      qrCode: qrCodeImage,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = createEvent;
