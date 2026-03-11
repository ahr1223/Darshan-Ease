const express = require("express");
const router = express.Router();
const { getAllUsers, getAllBookings, getAllOrganizers } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/users", protect, authorizeRoles("ADMIN"), getAllUsers);
router.get("/bookings", protect, authorizeRoles("ADMIN"), getAllBookings);
router.get("/organizers", protect, authorizeRoles("ADMIN"), getAllOrganizers);

module.exports = router;
