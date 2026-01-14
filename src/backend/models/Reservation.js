const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  startTime: {
    type: Date,
    required: [true, 'Veuillez fournir une heure de début']
  },
  endTime: {
    type: Date,
    required: [true, 'Veuillez fournir une heure de fin']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that endTime is after startTime
reservationSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    const error = new Error('L\'heure de fin doit être après l\'heure de début');
    return next(error);
  }
  next();
});

// Index for querying reservations
reservationSchema.index({ userId: 1, createdAt: -1 });
reservationSchema.index({ roomId: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
