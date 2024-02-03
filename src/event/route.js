const express = require("express");
const { isAuthenticated, requireRole } = require("../../middleware/auth");
const createEvent = require("./controllers/createEvent");
const getAllEvents = require("./controllers/getAllEvents");
const getEvent = require("./controllers/getEvent");
const updateEvent = require("./controllers/updateEvent");
const deleteEvent = require("./controllers/deleteEvent");
const joinEvent = require("./controllers/joinEvent");
const createSession = require("./controllers/createSession");
const validateInput = require("../../middleware/validateInput");
const { sessionCreationSchema } = require("./schema/session.schema");
const getAllSessions = require("./controllers/getAllSessions");
const getSession = require("./controllers/getSession");
const updateSession = require("./controllers/updateSession");
const deleteSession = require("./controllers/deleteSession");
const joinSession = require("./controllers/joinSession");
const getAttendance = require("./controllers/getAttendance");
const getAttendanceSummary = require("./controllers/getAttendanceSummary");

const router = express.Router();

// Get All Events
router.get("/", isAuthenticated, requireRole(["host"]), getAllEvents);

// Create Event
router.post("/", isAuthenticated, requireRole(["host"]), createEvent);

// Get Event
router.get("/:eid", isAuthenticated, getEvent);

// Update Event
router.patch("/:eid", isAuthenticated, requireRole(["host"]), updateEvent);

// Delete Event
router.delete("/:eid", isAuthenticated, requireRole(["host"]), deleteEvent);

// Join Event
router.post(
  "/:eid/join-event",
  isAuthenticated,
  requireRole(["participant", "host"]),
  joinEvent
);

// Session
// Get All Sessions
router.get("/:eid/sessions", isAuthenticated, getAllSessions);

// Create Sessions
router.post(
  "/:eid/sessions",
  validateInput(sessionCreationSchema),
  isAuthenticated,
  requireRole(["host"]),
  createSession
);

// Get Session
router.get("/:eid/sessions/:sid", isAuthenticated, getSession);

// Update Session
// Exercise: Create Update Schema and Validate Input
router.patch(
  "/:eid/sessions/:sid",
  isAuthenticated,
  requireRole(["host"]),
  updateSession
);

// Delete Session
router.delete(
  "/:eid/sessions/:sid",
  isAuthenticated,
  requireRole("host"),
  deleteSession
);

// Join Session
router.post(
  "/:eid/sessions/:sid/join-session",
  isAuthenticated,
  requireRole(["participant"]),
  joinSession
);

router.get(
  "/:eid/sessions/:sid/attendance",
  isAuthenticated,
  requireRole(["host"]),
  getAttendance
);

router.get(
  "/:eid/sessions/:sid/attendance-summary",
  isAuthenticated,
  requireRole(["host"]),
  getAttendanceSummary
);

module.exports = router;
