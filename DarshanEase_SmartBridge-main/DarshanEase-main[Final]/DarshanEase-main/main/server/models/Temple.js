const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema({
  templeName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  image: { type: String, default: "" },
  liveStreamUrl: { type: String, default: "" },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Temple", templeSchema);
