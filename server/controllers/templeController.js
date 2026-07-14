const Temple = require("../models/Temple");


const getAllTemples = async (req, res) => {
    try {
        const temples = await Temple.find();
        res.json(temples);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTempleById = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) {
            return res.status(404).json({ message: "Temple Not Found" });
        }
        res.json(temple);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMyTemple = async (req, res) => {
    try {
        const organizerId = req.user._id || req.user.id;
        const temple = await Temple.findOne({ organizerId });
        
        if (!temple) {
            return res.status(200).json({
                templeName: "",
                location: "",
                darshanStartTime: "",
                darshanEndTime: "",
                description: "",
                imageUrl: ""
            });
        }
        res.status(200).json(temple);
    } catch (error) {
        res.status(500).json({ message: "Error fetching organizer temple profile", error: error.message });
    }
};

const addTemple = async (req, res) => {
    try {
        const organizerId = req.user._id || req.user.id;
        const temple = await Temple.create({
            organizerId, 
            templeName: req.body.templeName,
            location: req.body.location,
            darshanStartTime: req.body.darshanStartTime,
            darshanEndTime: req.body.darshanEndTime,
            description: req.body.description,
            imageUrl: req.body.imageUrl || req.body.image || ""
        });
        res.status(201).json(temple);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) {
            return res.status(404).json({ message: "Temple Not Found" });
        }

        temple.templeName = req.body.templeName || temple.templeName;
        temple.location = req.body.location || temple.location;
        temple.darshanStartTime = req.body.darshanStartTime || temple.darshanStartTime;
        temple.darshanEndTime = req.body.darshanEndTime || temple.darshanEndTime;
        temple.description = req.body.description || temple.description;
        
        
        temple.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : (req.body.image !== undefined ? req.body.image : temple.imageUrl);

        const updatedTemple = await temple.save();
        res.json(updatedTemple);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) {
            return res.status(404).json({ message: "Temple Not Found" });
        }
        await temple.deleteOne();
        res.json({ message: "Temple Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTemples,
    getTempleById,
    getMyTemple, 
    addTemple,
    updateTemple,
    deleteTemple
};