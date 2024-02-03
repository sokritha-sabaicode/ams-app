const { getUserDetailFromDBByUID } = require("../../../middleware/auth");
const { STATUS_CODE } = require("../../../utils/const");
const { transferError } = require("../../../utils/error");
const { httpResponse } = require("../../../utils/response");
const EventModel = require("../models/Event.model");

const joinEvent = async (req, res, next) => {
  // TODO
  // 1. Get the userId from the request
  // 2. Get the detail user participant from userId
  // 3. Check if event that want to join is exist
  // 4. Check if the code that user want to join have in the event
  // 5. Check if the user already participants
  // 6. Add the Participant to the event
  // 7. Add the EventId to User's eventIds
  try {
    // Step 1
    const userId = req.userId;

    // Step 2
    const participant = await getUserDetailFromDBByUID(userId);

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

    // Step 4
    const givenCode = req.query.code;
    if (event.code !== givenCode) {
      const error = transferError(STATUS_CODE.NOT_FOUND, "Code is not correct");
      return next(new Error(error));
    }

    // Step 5
    if (event.participants.includes(participant._id)) {
      const error = transferError(
        STATUS_CODE.BAD_REQUEST,
        "You are already a participant in this event"
      );
      return next(new Error(error));
    }

    // Step 6
    event.participants.push(participant._id);
    await event.save();

    // Step 7
    participant.eventIds.push(eventId);
    await participant.save();

    httpResponse(res, STATUS_CODE.CREATED, "success", {
      message: "Joined event successfully",
    });
  } catch (err) {
    return next(new Error(err));
  }
};

module.exports = joinEvent;
