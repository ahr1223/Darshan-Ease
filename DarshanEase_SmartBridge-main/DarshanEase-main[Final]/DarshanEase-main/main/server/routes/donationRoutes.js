const express = require("express");
const router = express.Router();
const { createDonation, getUserDonations, getAllDonations } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, createDonation);
router.get("/user", protect, getUserDonations);
router.get("/all", protect, authorizeRoles("ADMIN"), getAllDonations);

module.exports = router;
