/*const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        slotId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "DarshanSlot",

            required: true

        },

        bookingDate: {

            type: Date,

            default: Date.now

        },

        noOfTickets: {

            type: Number,

            required: true,

            min: 1

        },

        totalAmount: {

            type: Number,

            required: true

        },

        status: {

            type: String,

            enum: [
                "Booked",
                "Cancelled",
                "Completed"
            ],

            default: "Booked"

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Booking", bookingSchema); */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'DarshanSlot', required: true },
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
    bookingDate: { type: Date, default: Date.now },
    darshanTiming: { type: String, required: true },
    noOfTickets: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    qrToken: { type: String, required: true },

    // Add this
    status: {
        type: String,
        enum: ["Booked", "Cancelled", "Completed"],
        default: "Booked"
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);