const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom de chambre'],
    unique: true,
    enum: ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton']
  },
  floor: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  roomNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  capacity: {
    type: Number,
    required: true,
    enum: [1, 2, 4]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  amenities: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for querying rooms by floor and room number
roomSchema.index({ floor: 1, roomNumber: 1 });

module.exports = mongoose.model('Room', roomSchema);
