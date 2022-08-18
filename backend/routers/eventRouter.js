const router = require("express").Router();
const { isAdmin, isAuthorized } = require("../authentication");
const {
  createEvent,
  getAllEvents,
  modifyEvent,
  deleteEvent,
  regEvent,
  getEvents,
} = require("../controllers/eventController");
var cors = require("cors");
router.use(cors())
router.route("/").post( createEvent).get( getAllEvents);
router.route("/:eventid").patch(modifyEvent).delete(deleteEvent).post(regEvent);
router.route("/user/:userid").get(getEvents)
module.exports = router;