const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Register User
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role
        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            role: role ? role.toLowerCase() : "user" // Ensures lowercase compatibility with middleware checks
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (
            user &&
            await bcrypt.compare(password, user.password)
        ) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Logged-in User Profile
const getProfile = async (req, res) => {
    try {
        // Fallback checks: parse parameter ID from URL routing first, otherwise drop back to verified token payload context
        const targetId = req.params.id || (req.user && req.user._id) || (req.user && req.user.id);

        if (!targetId) {
            return res.status(400).json({
                message: "User Identification parameter missing from execution chain."
            });
        }

        const user = await User.findById(targetId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(
                req.body.password,
                salt
            );
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            role: updatedUser.role
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};