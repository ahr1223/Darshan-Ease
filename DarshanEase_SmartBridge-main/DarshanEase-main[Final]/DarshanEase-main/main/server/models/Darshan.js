const mongoose = require("mongoose");

const darshanSchema = new mongoose.Schema({
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    required: true,
  },
  darshanName: { type: String, required: true },
  openTime: String,
  closeTime: { type: String, required: true },
  normalPrice: { type: Number, required: true, min: 0 },
  vipPrice: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1, default: 100 },
  availableSeats: { type: Number, required: true, min: 0, default: 100 },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Darshan", darshanSchema);
