const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");
const crypto = require("crypto");


const createBooking = async (req, res) => {
  try {
    const { slotId, noOfTickets } = req.body;

   
    const slot = await DarshanSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Darshan Slot Not Found",
      });
    }

   
    if (slot.availableSeats < Number(noOfTickets)) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    
    const totalAmount = slot.normalPrice * Number(noOfTickets);

    const bookingId =
      "BK" +
      Date.now() +
      Math.floor(Math.random() * 1000);

    const qrToken = crypto.randomUUID();

    const darshanTiming = `${slot.startTime} - ${slot.endTime}`;

    
    const booking = await Booking.create({
      bookingId,
      userId: req.user._id,
      slotId: slot._id,
      templeId: slot.templeId,
      bookingDate: new Date(),
      darshanTiming,
      noOfTickets: Number(noOfTickets),
      totalAmount,
      qrToken,
    });

    
    slot.availableSeats -= Number(noOfTickets);

    await slot.save();

    res.status(201).json({
      success: true,
      message: "Booking Successful",
      booking,
    });

  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("userId")
      .populate({
        path: "slotId",
        populate: {
          path: "templeId",
        },
      });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId")
      .populate({
        path: "slotId",
        populate: {
          path: "templeId",
        },
      });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    const slot = await DarshanSlot.findById(booking.slotId);

    if (slot) {
      slot.availableSeats += booking.noOfTickets;
      await slot.save();
    }

    booking.status = "Cancelled";

    await booking.save();

    res.json({
      message: "Booking Cancelled Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};