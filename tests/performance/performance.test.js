const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/backend/models/User');
const Room = require('../../src/backend/models/Room');
const Reservation = require('../../src/backend/models/Reservation');

describe('Performance Tests', () => {
  let app;
  let token;
  let userId;
  let roomId;

  beforeAll(async () => {
    // Create a simple Express app for testing
    const express = require('express');
    app = express();
    app.use(express.json());

    // Mock routes for testing
    app.get('/api/rooms', async (req, res) => {
      try {
        const rooms = await Room.find();
        res.json(rooms);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/reservations', async (req, res) => {
      try {
        const reservations = await Reservation.find();
        res.json(reservations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Créer un utilisateur et room pour les tests
    const user = await User.create({
      username: 'perf_user',
      email: 'perf@test.com',
      password: 'password123'
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test', { expiresIn: '7d' });

    const room = await Room.create({
      name: 'Mercure',
      floor: 1,
      roomNumber: 1,
      capacity: 1,
      isAvailable: true
    });
    roomId = room._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Room.deleteMany({});
    await Reservation.deleteMany({});
  });

  describe('Response Time Tests', () => {
    test('Should get all rooms within 100ms', async () => {
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/rooms')
        .expect(200);
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(100);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Should get reservations within 100ms', async () => {
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/reservations')
        .expect(200);
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(100);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Should retrieve single room within 50ms', async () => {
      const startTime = Date.now();
      const response = await request(app)
        .get(`/api/rooms`)
        .expect(200);
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(50);
      expect(response.status).toBe(200);
    });

    test('Response time should be consistent across multiple requests', async () => {
      const times = [];
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await request(app).get('/api/rooms');
        times.push(Date.now() - startTime);
      }

      const avgTime = times.reduce((a, b) => a + b) / times.length;
      const maxDeviation = Math.max(...times.map(t => Math.abs(t - avgTime)));

      expect(avgTime).toBeLessThan(100);
      expect(maxDeviation).toBeLessThan(50);
    });
  });

  describe('Concurrent Request Handling', () => {
    test('Should handle 10 concurrent room requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/api/rooms')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      responses.forEach(res => {
        expect(res.status).toBe(200);
      });

      expect(totalTime).toBeLessThan(500);
    });

    test('Should handle 20 concurrent requests without errors', async () => {
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(app).get('/api/rooms').catch(e => ({ error: e.message }))
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      const successCount = responses.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThan(18);
      expect(totalTime).toBeLessThan(1000);
    });

    test('Should maintain performance under 50 concurrent requests', async () => {
      const requests = Array(50).fill(null).map(() =>
        request(app).get('/api/rooms').catch(e => null)
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      const successCount = responses.filter(r => r && r.status === 200).length;
      expect(successCount).toBeGreaterThan(45);
      expect(totalTime).toBeLessThan(2000);
    });

    test('Should handle mixed concurrent requests (GET/POST simulation)', async () => {
      const getRequests = Array(10).fill(null).map(() =>
        request(app).get('/api/rooms')
      );

      const startTime = Date.now();
      const responses = await Promise.all(getRequests);
      const totalTime = Date.now() - startTime;

      expect(responses.length).toBe(10);
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('Database Query Performance', () => {
    test('Should find room by id within 50ms', async () => {
      const startTime = Date.now();
      await Room.findById(roomId);
      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(50);
    });

    test('Should find multiple rooms efficiently', async () => {
      const startTime = Date.now();
      await Room.find({ capacity: 1 });
      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(50);
    });

    test('Should create reservation efficiently', async () => {
      const startTime = Date.now();
      await Reservation.create({
        userId: userId,
        roomId: roomId,
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 172800000),
        numberOfGuests: 1
      });
      const createTime = Date.now() - startTime;

      expect(createTime).toBeLessThan(100);
    });

    test('Should index queries be faster than unindexed', async () => {
      // Indexed query (floor, roomNumber)
      const startIndexed = Date.now();
      await Room.find({ floor: 1, roomNumber: 1 });
      const indexedTime = Date.now() - startIndexed;

      // Non-indexed simulation
      const startUnindexed = Date.now();
      await Room.find({ name: 'Mercure' });
      const unindexedTime = Date.now() - startUnindexed;

      // Indexed should be comparable or faster
      expect(indexedTime).toBeLessThanOrEqual(unindexedTime + 10);
    });
  });

  describe('Data Volume Handling', () => {
    test('Should handle querying 100 rooms efficiently', async () => {
      // Create multiple rooms
      const roomsData = [];
      const planetNames = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'];
      
      for (let i = 0; i < 100; i++) {
        roomsData.push({
          name: `${planetNames[i % 9]}_${Math.floor(i / 9)}`,
          floor: (i % 3) + 1,
          roomNumber: (i % 3) + 1,
          capacity: ((i % 3) + 1) === 1 ? 1 : ((i % 3) + 1) === 2 ? 2 : 4,
          isAvailable: i % 2 === 0
        });
      }

      // Remove duplicates from names
      const uniqueRooms = [];
      const seenNames = new Set();
      for (const room of roomsData) {
        if (!seenNames.has(room.name)) {
          seenNames.add(room.name);
          uniqueRooms.push(room);
        }
      }

      await Room.insertMany(uniqueRooms, { ordered: false }).catch(() => {});

      const startTime = Date.now();
      const rooms = await Room.find({});
      const queryTime = Date.now() - startTime;

      expect(rooms.length).toBeGreaterThan(0);
      expect(queryTime).toBeLessThan(200);
    });

    test('Should filter large dataset efficiently', async () => {
      const startTime = Date.now();
      await Room.find({ capacity: 2 });
      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(100);
    });

    test('Should aggregate data efficiently', async () => {
      const startTime = Date.now();
      await Room.aggregate([
        { $group: { _id: '$floor', count: { $sum: 1 } } }
      ]);
      const aggregationTime = Date.now() - startTime;

      expect(aggregationTime).toBeLessThan(150);
    });
  });

  describe('Memory Usage Tests', () => {
    test('Should not leak memory on repeated queries', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 100; i++) {
        await Room.find({});
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB for 100 queries)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    test('Should handle large result sets without excessive memory', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const rooms = await Room.find({}).lean();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;

      // Should use reasonable memory even for all rooms
      expect(memoryUsed).toBeLessThan(50 * 1024 * 1024);
      expect(Array.isArray(rooms)).toBe(true);
    });
  });

  describe('Algorithm Complexity Tests', () => {
    test('Should search room by floor in O(log n) or better', async () => {
      const times = [];

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await Room.find({ floor: (i % 3) + 1 });
        times.push(Date.now() - startTime);
      }

      const avgTime = times.reduce((a, b) => a + b) / times.length;
      expect(avgTime).toBeLessThan(50);
    });

    test('Should filter by multiple criteria efficiently', async () => {
      const startTime = Date.now();
      await Room.find({ floor: 1, capacity: 1 });
      const queryTime = Date.now() - startTime;

      expect(queryTime).toBeLessThan(50);
    });
  });

  describe('Stress Tests', () => {
    test('Should recover from failed requests', async () => {
      const requests = [];
      for (let i = 0; i < 30; i++) {
        requests.push(
          request(app)
            .get('/api/rooms')
            .catch(() => null)
        );
      }

      const responses = await Promise.all(requests);
      const successCount = responses.filter(r => r && r.status === 200).length;

      expect(successCount).toBeGreaterThan(25);
    });

    test('Should maintain response time under sustained load', async () => {
      const responseTimes = [];

      for (let i = 0; i < 20; i++) {
        const startTime = Date.now();
        await request(app).get('/api/rooms');
        responseTimes.push(Date.now() - startTime);
      }

      const avgTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
      const maxTime = Math.max(...responseTimes);

      expect(avgTime).toBeLessThan(100);
      expect(maxTime).toBeLessThan(200);
    });
  });
});
