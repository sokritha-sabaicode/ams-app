const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");
const SessionModel = require("../models/Session.model");

const getAllSessions = async (req, res, next) => {
  // TODO
  // 1. Check if event exist
  // 2. Get All Session + Pagination
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;

    const sessions = await SessionModel.find().skip(startIndex).limit(limit);

    httpResponse(res, STATUS_CODE.OK, "success", {
      sessions,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = getAllSessions;
