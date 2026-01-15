const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');
const Room = require('../../src/models/Room');
const Reservation = require('../../src/models/Reservation');

let mongoServer;
let app;
let token, userId, roomId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(mongoUri);

  app = require('../../server');

  // Créer un utilisateur
  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

  token = signupRes.body.token;
  userId = signupRes.body.user.id;

  // Créer une chambre
  const room = await Room.create({
    name: 'Mercure',
    capacity: 1
  });

  roomId = room._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests d\'Intégration - Réservations', () => {
  afterEach(async () => {
    await Reservation.deleteMany({});
  });

  test('1. Créer une réservation avec données valides', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    expect(response.status).toBe(201);
    expect(response.body.reservation).toBeDefined();
  });

  test('2. Créer une réservation sans authentification', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    expect(response.status).toBe(401);
  });

  test('3. Récupérer les réservations de l\'utilisateur', async () => {
    await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    const response = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.reservations.length).toBeGreaterThan(0);
  });

  test('4. Créer une réservation avec date de fin avant la date de début', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-02').toISOString(),
        endDate: new Date('2024-03-01').toISOString()
      });

    expect(response.status).toBe(500);
  });

  test('5. Créer deux réservations non chevauchantes', async () => {
    const res1 = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    const res2 = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-05').toISOString(),
        endDate: new Date('2024-03-06').toISOString()
      });

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
  });

  test('6. Créer deux réservations chevauchantes doit échouer', async () => {
    await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-03').toISOString()
      });

    const res2 = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-02').toISOString(),
        endDate: new Date('2024-03-04').toISOString()
      });

    expect(res2.status).toBe(409);
  });

  test('7. Annuler une réservation', async () => {
    const createRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    const reservationId = createRes.body.reservation._id;

    const response = await request(app)
      .put(`/api/reservations/${reservationId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.reservation.status).toBe('cancelled');
  });

  test('8. Récupérer une réservation par ID', async () => {
    const createRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    const reservationId = createRes.body.reservation._id;

    const response = await request(app)
      .get(`/api/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.reservation._id).toBe(reservationId);
  });

  test('9. Créer une réservation avec chambre inexistante', async () => {
    const fakeRoomId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId: fakeRoomId.toString(),
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    expect(response.status).toBe(404);
  });

  test('10. Créer une réservation sans roomId', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        startDate: new Date('2024-03-01').toISOString(),
        endDate: new Date('2024-03-02').toISOString()
      });

    expect(response.status).toBe(400);
  });
});
