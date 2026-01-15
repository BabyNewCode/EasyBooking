const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

exports.createReservation = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const userId = req.userId;

    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ message: 'roomId, startDate et endDate sont requis' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifier si la chambre existe
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    // Vérifier s'il y a une chevauchement de réservations
    const existingReservation = await Reservation.findOne({
      room: roomId,
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ],
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      return res.status(409).json({ message: 'La chambre n\'est pas disponible pour cette période' });
    }

    // Créer la réservation
    const reservation = new Reservation({
      user: userId,
      room: roomId,
      startDate: start,
      endDate: end
    });

    await reservation.save();
    await reservation.populate('room');

    res.status(201).json({ 
      message: 'Réservation créée avec succès',
      reservation 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.userId;
    const reservations = await Reservation.find({ user: userId })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.userId;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    if (reservation.user.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Réservation annulée avec succès', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('room')
      .populate('user');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
