const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");

// Get all slots
const getAllSlots = async (req, res) => {
    try {
        const slots = await DarshanSlot.find().populate("templeId");
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get slots by temple
const getSlotsByTemple = async (req, res) => {
    try {
        const slots = await DarshanSlot.find({
            templeId: req.params.templeId
        });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get slot by ID
const getSlotById = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id).populate("templeId");
        if (!slot) {
            return res.status(404).json({ message: "Slot Not Found" });
        }
        res.json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Slot
const addSlot = async (req, res) => {
    try {
        let templeId = req.body.templeId;

        // FIXED: Added case-insensitive string matching (.toLowerCase()) to guarantee role discovery
        if (!templeId && req.user && req.user.role && req.user.role.toLowerCase() === 'organizer') {
            const temple = await Temple.findOne({ organizerId: req.user._id || req.user.id });
            if (!temple) {
                return res.status(404).json({ message: "No registered temple found for this organizer." });
            }
            templeId = temple._id;
        }

        if (!templeId) {
            return res.status(400).json({ message: "Temple ID is required." });
        }

        const slot = await DarshanSlot.create({
            templeId,
            darshanName: req.body.darshanName,
            date: req.body.date || new Date(),
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            availableSeats: req.body.availableSeats || 100,
            price: req.body.price || req.body.normalPrice || 0,
            normalPrice: req.body.normalPrice !== undefined ? req.body.normalPrice : (req.body.price || 0),
            vipPrice: req.body.vipPrice || 0,
            description: req.body.description || ""
        });

        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Slot
const updateSlot = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: "Slot Not Found" });
        }

        slot.darshanName = req.body.darshanName || slot.darshanName;
        slot.date = req.body.date || slot.date;
        slot.startTime = req.body.startTime || slot.startTime;
        slot.endTime = req.body.endTime || slot.endTime;
        slot.availableSeats = req.body.availableSeats !== undefined ? req.body.availableSeats : slot.availableSeats;
        slot.price = req.body.price || req.body.normalPrice || slot.price;
        slot.normalPrice = req.body.normalPrice !== undefined ? req.body.normalPrice : slot.normalPrice;
        slot.vipPrice = req.body.vipPrice !== undefined ? req.body.vipPrice : slot.vipPrice;
        slot.description = req.body.description || slot.description;

        const updatedSlot = await slot.save();
        res.json(updatedSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Slot
const deleteSlot = async (req, res) => {
    try {
        const slot = await DarshanSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: "Slot Not Found" });
        }

        await slot.deleteOne();
        res.json({ message: "Slot Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSlots,
    getSlotsByTemple,
    getSlotById,
    addSlot,
    updateSlot,
    deleteSlot
};