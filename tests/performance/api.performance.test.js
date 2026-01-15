const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');
const Room = require('../../src/models/Room');
const Reservation = require('../../src/models/Reservation');

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

describe('Tests de Performance', () => {
  test('1. Récupérer toutes les chambres - moins de 100ms', async () => {
    const start = performance.now();
    
    const response = await request(app)
      .get('/api/rooms');

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100);
  });

  test('2. Inscription rapide - moins de 200ms', async () => {
    const start = performance.now();
    
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser1',
        email: 'perf1@example.com',
        password: 'password123'
      });

    const duration = performance.now() - start;
    
    expect(response.status).toBe(201);
    expect(duration).toBeLessThan(200);
  });

  test('3. Connexion rapide - moins de 150ms', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser2',
        email: 'perf2@example.com',
        password: 'password123'
      });

    const start = performance.now();
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'perf2@example.com',
        password: 'password123'
      });

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(150);
  });

  test('4. Créer 10 utilisateurs rapidement', async () => {
    const start = performance.now();
    
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: `perfuser${i}`,
          email: `perf${i}@example.com`,
          password: 'password123'
        });
    }

    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(2000);
  });

  test('5. Créer une réservation rapidement - moins de 150ms', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser_reserv',
        email: 'perfreserv@example.com',
        password: 'password123'
      });

    const roomsRes = await request(app)
      .get('/api/rooms');
    const roomId = roomsRes.body.rooms[0]._id;

    const start = performance.now();
    
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${signupRes.body.token}`)
      .send({
        roomId,
        startDate: new Date('2024-04-01').toISOString(),
        endDate: new Date('2024-04-02').toISOString()
      });

    const duration = performance.now() - start;
    
    expect(response.status).toBe(201);
    expect(duration).toBeLessThan(150);
  });

  test('6. Récupérer le profil rapidement - moins de 100ms', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser_profile',
        email: 'perfprofile@example.com',
        password: 'password123'
      });

    const start = performance.now();
    
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${signupRes.body.token}`);

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100);
  });

  test('7. Annuler une réservation rapidement - moins de 100ms', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser_cancel',
        email: 'perfcancel@example.com',
        password: 'password123'
      });

    const roomsRes = await request(app)
      .get('/api/rooms');
    const roomId = roomsRes.body.rooms[0]._id;

    const reservRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${signupRes.body.token}`)
      .send({
        roomId,
        startDate: new Date('2024-05-01').toISOString(),
        endDate: new Date('2024-05-02').toISOString()
      });

    const reservationId = reservRes.body.reservation._id;

    const start = performance.now();
    
    const response = await request(app)
      .put(`/api/reservations/${reservationId}/cancel`)
      .set('Authorization', `Bearer ${signupRes.body.token}`);

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100);
  });

  test('8. Requêtes parallèles rapides', async () => {
    const start = performance.now();
    
    const promises = [
      request(app).get('/api/rooms'),
      request(app).get('/api/rooms'),
      request(app).get('/api/rooms'),
      request(app).get('/api/rooms'),
      request(app).get('/api/rooms')
    ];

    const results = await Promise.all(promises);
    const duration = performance.now() - start;
    
    results.forEach(res => {
      expect(res.status).toBe(200);
    });
    expect(duration).toBeLessThan(500);
  });

  test('9. Récupérer les réservations rapidement', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser_getres',
        email: 'perfgetres@example.com',
        password: 'password123'
      });

    const start = performance.now();
    
    const response = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${signupRes.body.token}`);

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100);
  });

  test('10. Filtrer les chambres disponibles - moins de 150ms', async () => {
    const start = performance.now();
    
    const response = await request(app)
      .get(`/api/rooms/available?startDate=${new Date('2024-06-01').toISOString()}&endDate=${new Date('2024-06-02').toISOString()}`);

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(150);
  });

  test('11. Créer 5 réservations consécutives rapidement', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'perfuser_multi',
        email: 'perfmulti@example.com',
        password: 'password123'
      });

    const roomsRes = await request(app)
      .get('/api/rooms');
    const room1 = roomsRes.body.rooms[0]._id;
    const room2 = roomsRes.body.rooms[1]._id;

    const start = performance.now();
    
    for (let i = 0; i < 5; i++) {
      const roomId = i % 2 === 0 ? room1 : room2;
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${signupRes.body.token}`)
        .send({
          roomId,
          startDate: new Date(2024, 6, 1 + i * 5).toISOString(),
          endDate: new Date(2024, 6, 2 + i * 5).toISOString()
        });
    }

    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(750);
  });

  test('12. Récupérer une chambre par ID - moins de 50ms', async () => {
    const roomsRes = await request(app)
      .get('/api/rooms');
    const roomId = roomsRes.body.rooms[0]._id;

    const start = performance.now();
    
    const response = await request(app)
      .get(`/api/rooms/${roomId}`);

    const duration = performance.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(50);
  });
});
