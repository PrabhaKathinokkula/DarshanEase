/*const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(

    {

        templeName:{

            type:String,

            required:true,

            trim:true

        },

        location:{

            type:String,

            required:true

        },

        darshanStartTime:{

            type:String,

            required:true

        },

        darshanEndTime:{

            type:String,

            required:true

        },

        description:{

            type:String,

            required:true

        },

        image:{

            type:String,

            default:""

        }

    },

    {

        timestamps:true

    }

);

module.exports = mongoose.model("Temple", templeSchema); */


const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
    templeName: { type: String, required: true },
    location: { type: String, required: true },
    darshanStartTime: { type: String, required: true }, // e.g., "05:32 AM"
    darshanEndTime: { type: String, required: true },   // e.g., "09:32 PM"
    description: { type: String },
    imageUrl: { type: String },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);