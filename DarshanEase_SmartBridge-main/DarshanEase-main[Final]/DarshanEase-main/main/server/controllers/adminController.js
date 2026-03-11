const User = require("../models/User");
const Booking = require("../models/Booking");

// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("templeId", "templeName location")
      .populate("darshanId", "darshanName");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/organizers
const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "ORGANIZER" }).select("-password");
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllBookings, getAllOrganizers };
