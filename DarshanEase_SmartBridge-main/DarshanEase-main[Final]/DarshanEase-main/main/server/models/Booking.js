const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
  darshanId: { type: mongoose.Schema.Types.ObjectId, ref: "Darshan", required: true },
  bookingDate: { type: String, required: true },
  darshanTime: String,
  tickets: { type: Number, required: true },
  ticketType: { type: String, enum: ["NORMAL", "VIP"], default: "NORMAL" },
  price: { type: Number, required: true },
  qrCode: String,
  status: { type: String, default: "CONFIRMED" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
