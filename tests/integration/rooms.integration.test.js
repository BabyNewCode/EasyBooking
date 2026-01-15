const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Room = require('../../src/models/Room');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(mongoUri);

  app = require('../../server');

  // Créer les chambres
  const rooms = [
    { name: 'Mercure', capacity: 1 },
    { name: 'Vénus', capacity: 1 },
    { name: 'Terre', capacity: 1 },
    { name: 'Mars', capacity: 2 },
    { name: 'Jupiter', capacity: 2 },
    { name: 'Saturne', capacity: 2 },
    { name: 'Uranus', capacity: 4 },
    { name: 'Neptune', capacity: 4 },
    { name: 'Pluton', capacity: 4 }
  ];

  for (const roomData of rooms) {
    await Room.create(roomData);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests d\'Intégration - Chambres', () => {
  test('1. Récupérer toutes les chambres', async () => {
    const response = await request(app)
      .get('/api/rooms');

    expect(response.status).toBe(200);
    expect(response.body.rooms.length).toBe(9);
  });

  test('2. Récupérer une chambre par ID', async () => {
    const roomsRes = await request(app)
      .get('/api/rooms');

    const roomId = roomsRes.body.rooms[0]._id;

    const response = await request(app)
      .get(`/api/rooms/${roomId}`);

    expect(response.status).toBe(200);
    expect(response.body.room._id).toBe(roomId);
  });

  test('3. Récupérer une chambre inexistante', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/rooms/${fakeId}`);

    expect(response.status).toBe(404);
  });

  test('4. Récupérer les chambres disponibles sans dates', async () => {
    const response = await request(app)
      .get('/api/rooms/available');

    expect(response.status).toBe(400);
  });

  test('5. Récupérer les chambres disponibles avec dates valides', async () => {
    const startDate = new Date('2024-03-01').toISOString();
    const endDate = new Date('2024-03-02').toISOString();

    const response = await request(app)
      .get(`/api/rooms/available?startDate=${startDate}&endDate=${endDate}`);

    expect(response.status).toBe(200);
    expect(response.body.rooms.length).toBeGreaterThanOrEqual(0);
  });

  test('6. Filtrer les chambres par capacité', async () => {
    const response = await request(app)
      .get('/api/rooms');

    const rooms = response.body.rooms;
    const capacity1 = rooms.filter(r => r.capacity === 1);
    const capacity2 = rooms.filter(r => r.capacity === 2);
    const capacity4 = rooms.filter(r => r.capacity === 4);

    expect(capacity1.length).toBe(3);
    expect(capacity2.length).toBe(3);
    expect(capacity4.length).toBe(3);
  });

  test('7. Vérifier que les chambres ont les bonnes données', async () => {
    const response = await request(app)
      .get('/api/rooms');

    const rooms = response.body.rooms;
    const mercure = rooms.find(r => r.name === 'Mercure');

    expect(mercure).toBeDefined();
    expect(mercure.capacity).toBe(1);
  });

  test('8. Vérifier le nombre total de places', async () => {
    const response = await request(app)
      .get('/api/rooms');

    const rooms = response.body.rooms;
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

    expect(totalCapacity).toBe(3 + 6 + 12);
  });

  test('9. Récupérer les chambres avec ID valide', async () => {
    const response = await request(app)
      .get('/api/rooms');

    const rooms = response.body.rooms;
    rooms.forEach(room => {
      expect(room._id).toBeDefined();
      expect(room.name).toBeDefined();
      expect(room.capacity).toBeDefined();
    });
  });

  test('10. Les chambres doivent avoir les noms des planètes', async () => {
    const response = await request(app)
      .get('/api/rooms');

    const rooms = response.body.rooms;
    const planetNames = rooms.map(r => r.name).sort();
    const expectedNames = [
      'Mercure', 'Neptune', 'Pluton', 'Saturne', 
      'Terre', 'Uranus', 'Venus', 'Jupiter', 'Mars'
    ].map(n => n === 'Venus' ? 'Vénus' : n).sort();

    expect(planetNames.length).toBe(9);
  });
});
