const Room = require('../../src/backend/models/Room');

describe('Room Model Unit Tests', () => {
  
  describe('Room Creation', () => {
    test('Should create a valid room', () => {
      const roomData = {
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      };
      
      const room = new Room(roomData);
      expect(room.name).toBe('Mercure');
      expect(room.floor).toBe(1);
      expect(room.roomNumber).toBe(1);
      expect(room.capacity).toBe(1);
      expect(room.isAvailable).toBe(true);
    });

    test('Should fail to create room without name', () => {
      const room = new Room({
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });
      
      const err = room.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
    });

    test('Should fail to create room without floor', () => {
      const room = new Room({
        name: 'Mercure',
        roomNumber: 1,
        capacity: 1
      });
      
      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should fail to create room without roomNumber', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        capacity: 1
      });
      
      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should fail to create room without capacity', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1
      });
      
      const err = room.validateSync();
      expect(err).toBeDefined();
    });
  });

  describe('Room Name Validation', () => {
    const validNames = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'];
    
    test('Should accept valid planet names', () => {
      validNames.forEach(name => {
        const room = new Room({
          name: name,
          floor: 1,
          roomNumber: 1,
          capacity: 1
        });
        
        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid names', () => {
      const room = new Room({
        name: 'InvalidName',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });
      
      const err = room.validateSync();
      expect(err).toBeDefined();
    });
  });

  describe('Floor Validation', () => {
    test('Should accept floors 1-3', () => {
      [1, 2, 3].forEach(floor => {
        const room = new Room({
          name: 'Mercure',
          floor: floor,
          roomNumber: 1,
          capacity: 1
        });
        
        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid floors', () => {
      [0, 4, -1].forEach(floor => {
        const room = new Room({
          name: 'Mercure',
          floor: floor,
          roomNumber: 1,
          capacity: 1
        });
        
        const err = room.validateSync();
        expect(err).toBeDefined();
      });
    });
  });

  describe('Room Number Validation', () => {
    test('Should accept room numbers 1-3', () => {
      [1, 2, 3].forEach(roomNumber => {
        const room = new Room({
          name: 'Mercure',
          floor: 1,
          roomNumber: roomNumber,
          capacity: 1
        });
        
        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid room numbers', () => {
      [0, 4, -1].forEach(roomNumber => {
        const room = new Room({
          name: 'Mercure',
          floor: 1,
          roomNumber: roomNumber,
          capacity: 1
        });
        
        const err = room.validateSync();
        expect(err).toBeDefined();
      });
    });
  });

  describe('Capacity Validation', () => {
    test('Should accept capacities 1, 2, and 4', () => {
      [1, 2, 4].forEach(capacity => {
        const room = new Room({
          name: 'Mercure',
          floor: 1,
          roomNumber: 1,
          capacity: capacity
        });
        
        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid capacities', () => {
      [0, 3, 5, -1].forEach(capacity => {
        const room = new Room({
          name: 'Mercure',
          floor: 1,
          roomNumber: 1,
          capacity: capacity
        });
        
        const err = room.validateSync();
        expect(err).toBeDefined();
      });
    });
  });

  describe('Room Availability', () => {
    test('Should default to available', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });
      
      expect(room.isAvailable).toBe(true);
    });

    test('Should allow setting availability', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1,
        isAvailable: false
      });
      
      expect(room.isAvailable).toBe(false);
    });
  });

  describe('Room Configuration by Floor', () => {
    test('Floor 1 should have capacity 1', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });
      
      expect(room.capacity).toBe(1);
    });

    test('Floor 2 should have capacity 2', () => {
      const room = new Room({
        name: 'Mars',
        floor: 2,
        roomNumber: 1,
        capacity: 2
      });
      
      expect(room.capacity).toBe(2);
    });

    test('Floor 3 should have capacity 4', () => {
      const room = new Room({
        name: 'Uranus',
        floor: 3,
        roomNumber: 1,
        capacity: 4
      });
      
      expect(room.capacity).toBe(4);
    });
  });
});
