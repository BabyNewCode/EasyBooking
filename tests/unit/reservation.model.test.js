const Reservation = require('../../src/backend/models/Reservation');
const mongoose = require('mongoose');

describe('Reservation Model Unit Tests', () => {
  
  describe('Reservation Creation', () => {
    test('Should create a valid reservation', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const startTime = new Date('2026-02-01T10:00:00');
      const endTime = new Date('2026-02-01T12:00:00');
      
      const reservationData = {
        userId,
        roomId,
        startTime,
        endTime,
        numberOfGuests: 2
      };
      
      const reservation = new Reservation(reservationData);
      expect(reservation.userId).toEqual(userId);
      expect(reservation.roomId).toEqual(roomId);
      expect(reservation.numberOfGuests).toBe(2);
      expect(reservation.status).toBe('pending');
    });

    test('Should fail to create reservation without userId', () => {
      const roomId = new mongoose.Types.ObjectId();
      const reservation = new Reservation({
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.userId).toBeDefined();
    });

    test('Should fail to create reservation without roomId', () => {
      const userId = new mongoose.Types.ObjectId();
      const reservation = new Reservation({
        userId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.roomId).toBeDefined();
    });

    test('Should fail to create reservation without startTime', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const reservation = new Reservation({
        userId,
        roomId,
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
    });

    test('Should fail to create reservation without endTime', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
    });

    test('Should fail to create reservation without numberOfGuests', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00')
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
    });
  });

  describe('Time Validation', () => {
    test('Should reject if endTime is before startTime', async () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const startTime = new Date('2026-02-01T12:00:00');
      const endTime = new Date('2026-02-01T10:00:00');
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime,
        endTime,
        numberOfGuests: 2
      });
      
      try {
        await reservation.validate();
        fail('Should have thrown error');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('Should reject if endTime equals startTime', async () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const sameTime = new Date('2026-02-01T10:00:00');
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: sameTime,
        endTime: sameTime,
        numberOfGuests: 2
      });
      
      try {
        await reservation.validate();
        fail('Should have thrown error');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    test('Should accept valid time range', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const startTime = new Date('2026-02-01T10:00:00');
      const endTime = new Date('2026-02-01T12:00:00');
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime,
        endTime,
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Status Management', () => {
    test('Should default to pending status', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      expect(reservation.status).toBe('pending');
    });

    test('Should accept valid status values', () => {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      validStatuses.forEach(status => {
        const reservation = new Reservation({
          userId,
          roomId,
          startTime: new Date('2026-02-01T10:00:00'),
          endTime: new Date('2026-02-01T12:00:00'),
          numberOfGuests: 2,
          status
        });
        
        const err = reservation.validateSync();
        expect(err).toBeUndefined();
      });
    });
  });

  describe('Number of Guests', () => {
    test('Should enforce minimum guests', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 0
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
    });

    test('Should accept valid number of guests', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 4
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Optional Fields', () => {
    test('Should allow notes', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        notes: 'Special request for high floor'
      });
      
      expect(reservation.notes).toBe('Special request for high floor');
    });

    test('Should allow creation without notes', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      expect(reservation.notes).toBeUndefined();
    });
  });

  describe('Timestamps', () => {
    test('Should have createdAt and updatedAt', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      expect(reservation.createdAt).toBeDefined();
      expect(reservation.updatedAt).toBeDefined();
    });
  });
});
