const User = require('../models/User');
const Temple = require('../models/Temple');
const DarshanSlot = require('../models/DarshanSlot');
const Booking = require('../models/Booking');

exports.getOrganizerDashboard = async (req, res, next) => {
    try {
        const organizerId = req.user.id || req.user._id;
        const temple = await Temple.findOne({ organizerId });
        
        if (!temple) {
            return res.status(200).json({
                temples: 0,
                slots: 0,
                bookings: 0,
                revenue: 0
            });
        }

        const slotsCount = await DarshanSlot.countDocuments({ templeId: temple._id });
        const bookings = await Booking.find({ templeId: temple._id });
        
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        res.status(200).json({
            temples: 1,
            slots: slotsCount,
            bookings: bookings.length,
            revenue: totalRevenue
        });
    } catch (err) { next(err); }
};


exports.getAdminDashboard = async (req, res, next) => {
    try {
        
        const users = await User.countDocuments({ 
            role: { $regex: /^(user|devotee)$/, $options: 'i' } 
        });
        
        const organizers = await User.countDocuments({ 
            role: { $regex: /^organizer$/, $options: 'i' } 
        });
        
        const temples = await Temple.countDocuments();
        const darshans = await DarshanSlot.countDocuments();
        const bookings = await Booking.countDocuments();

        
        res.status(200).json({ 
            users, 
            organizers, 
            temples, 
            slots: darshans, 
            bookings 
        });
    } catch (err) { next(err); }
};