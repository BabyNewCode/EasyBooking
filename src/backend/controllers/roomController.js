const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

// @desc Get all rooms
// @route GET /api/rooms
// @access Public
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get room by ID
// @route GET /api/rooms/:id
// @access Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.status(200).json({ data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get room availability
// @route GET /api/rooms/:id/availability
// @access Public
exports.getRoomAvailability = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const roomId = req.params.id;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'startTime et endTime sont requis' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check for overlapping reservations
    const conflictingReservations = await Reservation.findOne({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    const isAvailable = !conflictingReservations;

    res.status(200).json({
      roomId,
      startTime,
      endTime,
      isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a room (Admin only)
// @route POST /api/rooms
// @access Private
exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ data: room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
