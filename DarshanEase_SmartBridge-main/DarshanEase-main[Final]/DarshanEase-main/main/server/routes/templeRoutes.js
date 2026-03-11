const express = require("express");
const router = express.Router();
const {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
} = require("../controllers/templeController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getTemples);
router.get("/:id", getTempleById);
router.post("/", protect, authorizeRoles("ORGANIZER", "ADMIN"), createTemple);
router.put("/:id", protect, authorizeRoles("ORGANIZER", "ADMIN"), updateTemple);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteTemple);

module.exports = router;
