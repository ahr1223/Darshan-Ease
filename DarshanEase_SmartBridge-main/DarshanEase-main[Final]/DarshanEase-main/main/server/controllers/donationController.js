const Donation = require("../models/Donation");

// @route POST /api/donations
const createDonation = async (req, res) => {
  try {
    const { templeId, amount, message } = req.body;
    const donation = await Donation.create({
      userId: req.user._id,
      templeId,
      amount,
      message: message || "",
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/donations/user
const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id })
      .populate("templeId", "templeName location image");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/donations/all  (ADMIN only)
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("userId", "name email")
      .populate("templeId", "templeName location");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDonation, getUserDonations, getAllDonations };
