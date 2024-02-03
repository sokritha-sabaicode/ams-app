const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");

const getEvent = async (req, res, next) => {
  // TODO
  // 1. Get the event id from params
  // 2. Get Event by id from DB
  // 3. Send to Client

  try {
    // Step 1
    const eventId = req.params.eid;

    // Step 2
    const event = await EventModel.findById(eventId)
      .populate("host", "username email -_id")
      .populate("participants", "username email -_id");

    if (!event) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `Event with this ${eventId} not found`
      );
      return next(new Error(error));
    }

    httpResponse(res, STATUS_CODE.OK, "success", event);
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = getEvent;
