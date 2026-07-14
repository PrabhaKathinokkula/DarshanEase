const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/authController");

// IMPORTED: Destructured the administrative middleware role guard checker
const { protect, admin } = require("../middleware/authMiddleware");

// Add a fallback helper method directly inside the controller file to serve list data array lookups
const User = require("../models/User");
const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Hide password hashes for safety
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to load system profile list data registry indices" });
    }
};

// Authentication Entry Points
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN PROTECTION API ROUTE PATH: Handles the account list arrays payload sync request
router.get("/all-users", protect, admin, getAllUsersAdmin);

// Handle profile requests without an explicit ID parameter
router.get("/profile", protect, getProfile);

// Dynamic parameter mapping matches your frontend URL query pattern directly
router.get("/profile/:id", protect, getProfile);

// Update User Profile
router.put("/profile/:id", protect, updateProfile);

module.exports = router;