const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");

const getAllEvents = async (req, res, next) => {
  // TODO
  // 1. Get the user id from request
  // 2. Get the detail info of user from the user id
  // 3. Find all events that own by that user + Pagination
  try {
    // Step 1
    const userId = req.userId;

    // Step 2
    const user = await getUserDetailFromDBByUID(userId);

    if (!user) {
      const error = transferError(STATUS_CODE.NOT_FOUND, "User does not exist");
      return next(new Error(error));
    }

    // Step 3
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const startIndex = (page - 1) * limit;
    const events = await EventModel.find({ host: user._id })
      .skip(startIndex)
      .limit(limit);

    if (!events) {
      const error = transferError(STATUS_CODE.NOT_FOUND, "Event not found!");
      return next(new Error(error));
    }

    httpResponse(res, STATUS_CODE.OK, "success", {
      events,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = getAllEvents;
