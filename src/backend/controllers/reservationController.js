const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

// @desc Create a reservation
// @route POST /api/reservations
// @access Private
exports.createReservation = async (req, res) => {
  try {
    const { roomId, startTime, endTime, numberOfGuests, notes } = req.body;

    // Validation
    if (!roomId || !startTime || !endTime || !numberOfGuests) {
      return res.status(400).json({ message: 'Tous les champs requis manquent' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ message: 'L\'heure de fin doit être après l\'heure de début' });
    }

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Check room capacity
    if (numberOfGuests > room.capacity) {
      return res.status(400).json({ message: `La chambre ne peut accueillir que ${room.capacity} personne(s)` });
    }

    // Check for conflicts
    const conflictingReservation = await Reservation.findOne({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'Cette chambre n\'est pas disponible pour ce créneau' });
    }

    // Create reservation
    const reservation = new Reservation({
      userId: req.user.id,
      roomId,
      startTime: start,
      endTime: end,
      numberOfGuests,
      notes,
      status: 'confirmed'
    });

    await reservation.save();
    await reservation.populate(['userId', 'roomId']);

    res.status(201).json({
      message: 'Réservation créée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get user's reservations
// @route GET /api/reservations
// @access Private
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('roomId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get reservation by ID
// @route GET /api/reservations/:id
// @access Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate(['userId', 'roomId']);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Check authorization
    if (reservation.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.status(200).json({ data: reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update reservation
// @route PUT /api/reservations/:id
// @access Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Check authorization
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Prevent updating cancelled reservations
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Impossible de modifier une réservation annulée' });
    }

    const { startTime, endTime, numberOfGuests, notes } = req.body;

    if (startTime) reservation.startTime = new Date(startTime);
    if (endTime) reservation.endTime = new Date(endTime);
    if (numberOfGuests) reservation.numberOfGuests = numberOfGuests;
    if (notes !== undefined) reservation.notes = notes;

    reservation.updatedAt = new Date();

    await reservation.save();
    await reservation.populate(['userId', 'roomId']);

    res.status(200).json({
      message: 'Réservation mise à jour',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Cancel reservation
// @route DELETE /api/reservations/:id
// @access Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Check authorization
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'La réservation est déjà annulée' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      message: 'Réservation annulée',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
