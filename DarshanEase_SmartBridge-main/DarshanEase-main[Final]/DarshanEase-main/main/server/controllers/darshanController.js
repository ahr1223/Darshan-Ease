const Darshan = require("../models/Darshan");

// @route GET /api/darshans/:templeId
const getDarshansByTemple = async (req, res) => {
  try {
    const darshans = await Darshan.find({ templeId: req.params.templeId });
    res.json(darshans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to process times like "09:00" -> minutes
const timeToMinutes = (timeStr) => {
  const [hours, mins] = timeStr.split(":").map(Number);
  return hours * 60 + mins;
};

// Helper to format minutes -> "09:00"
const minutesToTime = (totalMins) => {
  const hours = String(Math.floor(totalMins / 60)).padStart(2, "0");
  const mins = String(totalMins % 60).padStart(2, "0");
  return `${hours}:${mins}`;
};

// @route POST /api/darshans
const createDarshan = async (req, res) => {
  try {
    const { templeId, darshanName, description, openTime, closeTime, normalPrice, vipPrice, capacity } = req.body;
    
    let currentMins = timeToMinutes(openTime);
    const endMins = timeToMinutes(closeTime);
    const slots = [];

    // Loop through open to close time, inserting a 1-hour chunk
    while (currentMins < endMins) {
      const slotStart = minutesToTime(currentMins);
      // Ensure we don't go past the closeTime
      const nextMins = Math.min(currentMins + 60, endMins);
      const slotEnd = minutesToTime(nextMins);

      slots.push({
        templeId,
        darshanName,
        description,
        openTime: slotStart,
        closeTime: slotEnd,
        normalPrice,
        vipPrice,
        capacity,
        availableSeats: capacity
      });

      currentMins = nextMins;
    }

    const createdDarshans = await Darshan.insertMany(slots);
    res.status(201).json(createdDarshans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/darshans/:id
const updateDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!darshan) return res.status(404).json({ message: "Darshan not found" });
    res.json(darshan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/darshans/:id
const deleteDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findByIdAndDelete(req.params.id);
    if (!darshan) return res.status(404).json({ message: "Darshan not found" });
    res.json({ message: "Darshan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDarshansByTemple, createDarshan, updateDarshan, deleteDarshan };
