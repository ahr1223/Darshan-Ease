const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    status: { type: String, enum: ["PENDING", "COMPLETED"], default: "COMPLETED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
