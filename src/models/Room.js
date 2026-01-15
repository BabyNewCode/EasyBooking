const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la chambre est requis'],
    unique: true,
    enum: [
      'Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter',
      'Saturne', 'Uranus', 'Neptune', 'Pluton'
    ]
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    enum: [1, 2, 4]
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: '/images/default-room.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
