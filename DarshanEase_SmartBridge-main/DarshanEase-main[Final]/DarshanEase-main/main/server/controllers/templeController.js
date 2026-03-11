const Temple = require("../models/Temple");

// @route GET /api/temples
const getTemples = async (req, res) => {
  try {
    const temples = await Temple.find().populate("organizerId", "name email");
    res.json(temples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/temples/:id
const getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id).populate("organizerId", "name email");
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/temples
const createTemple = async (req, res) => {
  try {
    const { templeName, location, description, openTime, closeTime, image, liveStreamUrl } = req.body;
    const temple = await Temple.create({
      templeName,
      location,
      description,
      openTime,
      closeTime,
      image,
      liveStreamUrl,
      organizerId: req.user._id,
    });
    res.status(201).json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/temples/:id
const updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json(temple);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/temples/:id
const deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json({ message: "Temple deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTemples, getTempleById, createTemple, updateTemple, deleteTemple };
