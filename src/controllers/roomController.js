const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate et endDate sont requis' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Trouver les réservations qui chevauchent la période demandée
    const bookedRooms = await Reservation.find({
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ],
      status: { $ne: 'cancelled' }
    }).select('room');

    const bookedRoomIds = bookedRooms.map(r => r.room.toString());

    // Retourner les chambres non réservées
    const availableRooms = await Room.find({ _id: { $nin: bookedRoomIds } });

    res.json({ rooms: availableRooms });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
