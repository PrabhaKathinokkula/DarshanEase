const express = require("express");
const router = express.Router();

const {
    getAllSlots,
    getSlotsByTemple,
    getSlotById,
    addSlot,
    updateSlot,
    deleteSlot
} = require("../controllers/slotController");

const {
    protect,
    organizer,
    admin
} = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllSlots);
router.get("/temple/:templeId", getSlotsByTemple);
router.get("/:id", getSlotById);

// Organizer Routes
router.post("/", protect, organizer, addSlot);
router.put("/:id", protect, organizer, updateSlot);

// Admin Route
router.delete("/:id", protect, admin, deleteSlot);

module.exports = router;