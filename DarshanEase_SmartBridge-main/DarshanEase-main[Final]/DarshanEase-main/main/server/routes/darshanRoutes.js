const express = require("express");
const router = express.Router();
const {
  getDarshansByTemple,
  createDarshan,
  updateDarshan,
  deleteDarshan,
} = require("../controllers/darshanController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/:templeId", getDarshansByTemple);
router.post("/", protect, authorizeRoles("ORGANIZER", "ADMIN"), createDarshan);
router.put("/:id", protect, authorizeRoles("ORGANIZER", "ADMIN"), updateDarshan);
router.delete("/:id", protect, authorizeRoles("ORGANIZER", "ADMIN"), deleteDarshan);

module.exports = router;
