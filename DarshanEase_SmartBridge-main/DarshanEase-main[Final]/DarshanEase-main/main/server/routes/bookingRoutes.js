const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings, cancelBooking, getOrganizerBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/organizer", protect, authorizeRoles("ORGANIZER", "ADMIN"), getOrganizerBookings);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
