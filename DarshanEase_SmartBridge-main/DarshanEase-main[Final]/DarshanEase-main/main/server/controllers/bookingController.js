const Booking = require("../models/Booking");
const Darshan = require("../models/Darshan");
const generateQR = require("../utils/qrGenerator");

// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { templeId, darshanId, bookingDate, darshanTime, tickets, ticketType } = req.body;

    const darshan = await Darshan.findById(darshanId);
    if (!darshan) return res.status(404).json({ message: "Darshan not found" });

    if (darshan.availableSeats < tickets) {
      return res.status(400).json({ message: `Only ${darshan.availableSeats} seats left for this slot` });
    }

    const pricePerTicket = ticketType === "VIP" ? darshan.vipPrice : darshan.normalPrice;
    const totalPrice = pricePerTicket * tickets;

    const booking = await Booking.create({
      userId: req.user._id,
      templeId,
      darshanId,
      bookingDate,
      darshanTime,
      tickets,
      ticketType: ticketType || "NORMAL",
      price: totalPrice,
    });

    // Deduct available seats
    darshan.availableSeats -= tickets;
    await darshan.save();

    // Generate QR code with booking info
    const qrData = {
      bookingId: booking._id,
      userId: req.user._id,
      templeId,
      darshanId,
      bookingDate,
      tickets,
      ticketType,
      price: totalPrice,
    };
    const qrCode = await generateQR(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bookings/user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("templeId", "templeName location image")
      .populate("darshanId", "darshanName openTime closeTime");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id }).populate("darshanId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "CANCELLED") return res.status(400).json({ message: "Booking already cancelled" });
    
    booking.status = "CANCELLED";
    await booking.save();

    // Restore available seats back to the darshan slot
    if (booking.darshanId) {
      const darshan = await Darshan.findById(booking.darshanId._id);
      if (darshan) {
        darshan.availableSeats += booking.tickets;
        await darshan.save();
      }
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bookings/organizer
const getOrganizerBookings = async (req, res) => {
  try {
    const Temple = require("../models/Temple");
    const myTemples = await Temple.find({ organizerId: req.user._id });
    const templeIds = myTemples.map((t) => t._id);

    const bookings = await Booking.find({ templeId: { $in: templeIds } })
      .populate("userId", "name email")
      .populate("templeId", "templeName location")
      .populate("darshanId", "darshanName openTime closeTime")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking, getOrganizerBookings };
