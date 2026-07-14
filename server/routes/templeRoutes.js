const express = require("express");
const router = express.Router();
const {
    getAllTemples,
    getTempleById,
    getMyTemple, // Imported the new dynamic operational aggregation handler
    addTemple,
    updateTemple,
    deleteTemple
} = require("../controllers/templeController");

const {
    protect,
    admin,
    organizer
} = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllTemples);

// Organizer Profile Verification Route
// CRITICAL: Must be registered ABOVE /:id so it doesn't get parsed as a MongoDB Hex ObjectId string
router.get("/my-temple", protect, getMyTemple);

// Dynamic Baseline Profile Parametric Identifier Routing
router.get("/:id", getTempleById);

// Organizer & Admin Write/Update Access Controls
router.post("/", protect, organizer, addTemple);
router.put("/:id", protect, organizer, updateTemple);
router.delete("/:id", protect, admin, deleteTemple);

module.exports = router;