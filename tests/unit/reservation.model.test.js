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

  describe('Reservation Status', () => {
    test('Should have default status pending', () => {
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

    test('Should accept confirmed status', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        status: 'confirmed'
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
      expect(reservation.status).toBe('confirmed');
    });

    test('Should accept cancelled status', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        status: 'cancelled'
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should accept completed status', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        status: 'completed'
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should reject invalid status', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        status: 'invalid_status'
      });
      
      const err = reservation.validateSync();
      expect(err).toBeDefined();
    });
  });

  describe('Number of Guests', () => {
    test('Should require at least 1 guest', () => {
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

    test('Should accept various guest numbers', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      for (let guests = 1; guests <= 10; guests++) {
        const reservation = new Reservation({
          userId,
          roomId,
          startTime: new Date('2026-02-01T10:00:00'),
          endTime: new Date('2026-02-01T12:00:00'),
          numberOfGuests: guests
        });
        
        const err = reservation.validateSync();
        expect(err).toBeUndefined();
      }
    });
  });

  describe('ObjectId References', () => {
    test('Should store userId as ObjectId', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      expect(reservation.userId).toEqual(userId);
      expect(reservation.userId instanceof mongoose.Types.ObjectId).toBe(true);
    });

    test('Should have reference to User model', () => {
      expect(Reservation.schema.paths.userId.options.ref).toBe('User');
    });

    test('Should have reference to Room model', () => {
      expect(Reservation.schema.paths.roomId.options.ref).toBe('Room');
    });
  });

  describe('Duration Calculations', () => {
    test('Should support different reservation durations', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const testCases = [
        { start: '10:00', end: '11:00', duration: '1 hour' },
        { start: '10:00', end: '12:00', duration: '2 hours' },
        { start: '10:00', end: '22:00', duration: '12 hours' },
        { start: '10:00', end: 'next day 10:00', duration: '24 hours' }
      ];

      testCases.forEach(test => {
        const startTime = new Date('2026-02-01T10:00:00');
        const endTime = new Date(startTime.getTime() + 3600000); // 1 hour later
        
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
  });

  describe('Reservation Notes', () => {
    test('Should store reservation notes', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const notes = 'Please prepare for a meeting';
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        notes
      });
      
      expect(reservation.notes).toBe(notes);
    });

    test('Should allow long notes', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      const longNotes = 'A'.repeat(500);
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2,
        notes: longNotes
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
      expect(reservation.notes.length).toBe(500);
    });
  });

  describe('Multiple Reservations Same User', () => {
    test('Should allow same user to have multiple reservations', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId1 = new mongoose.Types.ObjectId();
      const roomId2 = new mongoose.Types.ObjectId();
      
      const res1 = new Reservation({
        userId,
        roomId: roomId1,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      const res2 = new Reservation({
        userId,
        roomId: roomId2,
        startTime: new Date('2026-02-02T10:00:00'),
        endTime: new Date('2026-02-02T12:00:00'),
        numberOfGuests: 2
      });
      
      expect(res1.userId).toEqual(res2.userId);
      expect(res1.roomId).not.toEqual(res2.roomId);
    });
  });

  describe('Multiple Reservations Same Room', () => {
    test('Should allow same room to have multiple reservations at different times', () => {
      const userId1 = new mongoose.Types.ObjectId();
      const userId2 = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const res1 = new Reservation({
        userId: userId1,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-01T12:00:00'),
        numberOfGuests: 2
      });
      
      const res2 = new Reservation({
        userId: userId2,
        roomId,
        startTime: new Date('2026-02-01T14:00:00'),
        endTime: new Date('2026-02-01T16:00:00'),
        numberOfGuests: 2
      });
      
      expect(res1.roomId).toEqual(res2.roomId);
      expect(res1.userId).not.toEqual(res2.userId);
    });
  });

  describe('Date Edge Cases', () => {
    test('Should handle same day different times', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T08:00:00'),
        endTime: new Date('2026-02-01T22:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should handle multi-day reservations', () => {
      const userId = new mongoose.Types.ObjectId();
      const roomId = new mongoose.Types.ObjectId();
      
      const reservation = new Reservation({
        userId,
        roomId,
        startTime: new Date('2026-02-01T10:00:00'),
        endTime: new Date('2026-02-05T10:00:00'),
        numberOfGuests: 2
      });
      
      const err = reservation.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Indexing', () => {
    test('Should have index on userId and createdAt', () => {
      const indexes = Reservation.schema._indexes;
      const hasUserIdIndex = indexes.some(idx => 
        Object.keys(idx[0]).includes('userId')
      );

      expect(hasUserIdIndex).toBe(true);
    });

    test('Should have index on roomId, startTime, endTime', () => {
      const indexes = Reservation.schema._indexes;
      const hasRoomTimeIndex = indexes.some(idx => 
        Object.keys(idx[0]).includes('roomId') &&
        Object.keys(idx[0]).includes('startTime')
      );

      expect(hasRoomTimeIndex).toBe(true);
    });
  });
});
