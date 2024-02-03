const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");

const deleteEvent = async (req, res, next) => {
  // TODO
  // 1. Get userId from request
  // 2. Get user info from DB by userId
  // 3. Check if eventID exist
  // 4. Check if eventID belong to the user
  // 5. Delete Event
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
    const eventId = req.params.eid;
    const event = await EventModel.findById(eventId);

    if (!event) {
      const error = transferError(
        STATUS_CODE.NOT_FOUND,
        `Event with this ${eventId} not found`
      );
      return next(new Error(error));
    }

    console.log("host event", event.host);
    console.log("user id", user._id);

    // Step 4
    if (event.host.toString() !== user._id.toString()) {
      const error = transferError(
        STATUS_CODE.FORBIDDEN,
        "The event is not belong to the user"
      );
      return next(new Error(error));
    }

    await EventModel.findByIdAndDelete(eventId);

    httpResponse(res, STATUS_CODE.NO_CONTENT, "success", {});
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = deleteEvent;
