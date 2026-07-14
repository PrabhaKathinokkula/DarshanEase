const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema({
    templeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Temple', 
        required: true 
    },
    darshanName: { 
        type: String, 
        required: true 
    }, // e.g., "Seeghra Darshanam", "Sarva Darshan"
    date: { 
        type: Date, 
        required: true 
    },
    startTime: { 
        type: String, 
        required: true 
    },
    endTime: { 
        type: String, 
        required: true 
    },
    // Changed required to default values to prevent Mongoose schema verification from throwing silent 404/500 execution breaks
    normalPrice: { 
        type: Number, 
        default: 0 
    },
    vipPrice: { 
        type: Number, 
        default: 0 
    },
    availableSeats: { 
        type: Number, 
        required: true,
        default: 100
    },
    description: { 
        type: String,
        default: "" 
    }
}, { timestamps: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);