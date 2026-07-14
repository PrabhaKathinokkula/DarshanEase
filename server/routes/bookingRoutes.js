const express = require("express");

const router = express.Router();

const {

    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking

} = require("../controllers/bookingController");

const {

    protect,
    admin,
    organizer

} = require("../middleware/authMiddleware");

// User
router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.put("/cancel/:id", protect, cancelBooking);

// Organizer/Admin
router.get(
    "/",
    protect,
    (req, res, next) => {
        if (
            req.user.role === "Organizer" ||
            req.user.role === "Admin"
        ) {
            next();
        } else {
            res.status(403).json({
                message: "Access Denied"
            });
        }
    },
    getAllBookings
);

module.exports = router;