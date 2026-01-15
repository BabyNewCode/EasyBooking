const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'La chambre est requise']
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validation pour s'assurer que endDate > startDate
reservationSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    throw new Error('La date de fin doit être après la date de début');
  }
  next();
});

// Indexer pour les recherches rapides
reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ room: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
