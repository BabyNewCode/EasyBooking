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

  describe('All Nine Planets', () => {
    const planets = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'];

    test('Should accept all valid planet names', () => {
      planets.forEach(planet => {
        const room = new Room({
          name: planet,
          floor: 1,
          roomNumber: 1,
          capacity: 1
        });

        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid planet names', () => {
      const room = new Room({
        name: 'InvalidPlanet',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });

      const err = room.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
    });

    test('Should enforce unique room names', () => {
      const room1 = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });

      expect(room1.schema.paths.name.options.unique).toBe(true);
    });
  });

  describe('Room Amenities', () => {
    test('Should allow setting amenities', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1,
        amenities: ['WiFi', 'TV', 'AC']
      });

      expect(Array.isArray(room.amenities)).toBe(true);
      expect(room.amenities.length).toBe(3);
      expect(room.amenities).toContain('WiFi');
    });

    test('Should allow empty amenities array', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1,
        amenities: []
      });

      expect(Array.isArray(room.amenities)).toBe(true);
      expect(room.amenities.length).toBe(0);
    });
  });

  describe('Room Description', () => {
    test('Should allow setting room description', () => {
      const description = 'Beautiful room with ocean view';
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1,
        description: description
      });

      expect(room.description).toBe(description);
    });

    test('Should allow null description', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1,
        description: null
      });

      expect(room.description).toBeNull();
    });
  });

  describe('Floor Constraints', () => {
    test('Should reject invalid floor number (0)', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 0,
        roomNumber: 1,
        capacity: 1
      });

      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should reject floor number greater than 3', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 4,
        roomNumber: 1,
        capacity: 1
      });

      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should accept all valid floor numbers', () => {
      for (let floor = 1; floor <= 3; floor++) {
        const room = new Room({
          name: 'Mercure',
          floor: floor,
          roomNumber: 1,
          capacity: floor === 1 ? 1 : floor === 2 ? 2 : 4
        });

        const err = room.validateSync();
        expect(err).toBeUndefined();
      }
    });
  });

  describe('Room Number Constraints', () => {
    test('Should reject room number less than 1', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 0,
        capacity: 1
      });

      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should reject room number greater than 3', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 4,
        capacity: 1
      });

      const err = room.validateSync();
      expect(err).toBeDefined();
    });

    test('Should accept valid room numbers (1-3)', () => {
      for (let roomNumber = 1; roomNumber <= 3; roomNumber++) {
        const room = new Room({
          name: `Planet${roomNumber}`,
          floor: 1,
          roomNumber: roomNumber,
          capacity: 1
        });

        const err = room.validateSync();
        expect(err).toBeUndefined();
      }
    });
  });

  describe('Capacity Constraints', () => {
    test('Should only allow capacity 1, 2, or 4', () => {
      const validCapacities = [1, 2, 4];

      validCapacities.forEach(capacity => {
        const room = new Room({
          name: 'TestRoom',
          floor: 1,
          roomNumber: 1,
          capacity: capacity
        });

        const err = room.validateSync();
        expect(err).toBeUndefined();
      });
    });

    test('Should reject invalid capacities', () => {
      const invalidCapacities = [0, 3, 5, 6];

      invalidCapacities.forEach(capacity => {
        const room = new Room({
          name: 'TestRoom',
          floor: 1,
          roomNumber: 1,
          capacity: capacity
        });

        const err = room.validateSync();
        expect(err).toBeDefined();
      });
    });
  });

  describe('CreatedAt Timestamp', () => {
    test('Should set createdAt automatically', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });

      expect(room.createdAt).toBeDefined();
      expect(room.createdAt instanceof Date).toBe(true);
    });
  });

  describe('Multiple Rooms Configuration', () => {
    test('Should create all 9 rooms correctly', () => {
      const floors = {
        1: { capacity: 1, count: 3 },
        2: { capacity: 2, count: 3 },
        3: { capacity: 4, count: 3 }
      };

      const planets = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'];
      let planetIndex = 0;

      Object.entries(floors).forEach(([floor, config]) => {
        for (let i = 1; i <= config.count; i++) {
          const room = new Room({
            name: planets[planetIndex++],
            floor: parseInt(floor),
            roomNumber: i,
            capacity: config.capacity
          });

          expect(room.floor).toBe(parseInt(floor));
          expect(room.capacity).toBe(config.capacity);
          expect(room.roomNumber).toBe(i);
        }
      });

      expect(planetIndex).toBe(9);
    });
  });

  describe('Default Values', () => {
    test('Should have isAvailable default to true', () => {
      const room = new Room({
        name: 'Mercure',
        floor: 1,
        roomNumber: 1,
        capacity: 1
      });

      expect(room.isAvailable).toBe(true);
    });
  });

  describe('Indexing', () => {
    test('Should have index on floor and roomNumber', () => {
      // Verify that the schema defines indexes
      const indexes = Room.schema._indexes;
      const hasFloorRoomIndex = indexes.some(idx => 
        Object.keys(idx[0]).includes('floor') && 
        Object.keys(idx[0]).includes('roomNumber')
      );

      expect(hasFloorRoomIndex).toBe(true);
    });
  });
});
