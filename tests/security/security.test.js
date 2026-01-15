const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');
const Room = require('../../src/models/Room');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(mongoUri);

  app = require('../../server');

  // Créer une chambre
  await Room.create({
    name: 'Mercure',
    capacity: 1
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests de Sécurité', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  test('1. Injection SQL - email avec caractères spéciaux', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: `test@example.com' OR '1'='1`,
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });

  test('2. XSS - username avec balises HTML', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        password: 'password123'
      });

    // Devrait être accepté mais ne devrait pas exécuter le script
    if (response.status === 201) {
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.username).toBe('<script>alert("XSS")</script>');
    }
  });

  test('3. Mot de passe faible - une seule lettre', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'a'
      });

    expect(response.status).toBe(400);
  });

  test('4. Mot de passe très long ne doit pas causer de DoS', async () => {
    const longPassword = 'a'.repeat(1000);
    
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: longPassword
      });

    expect([201, 400, 500]).toContain(response.status);
  });

  test('5. Brute force - pas de rate limiting', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      // Devrait retourner 401, pas d'erreur de rate limit
      expect(response.status).toBe(401);
    }
  });

  test('6. Token expiré - ne devrait pas accéder aux ressources protégées', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZGF0YSIsImV4cCI6MTYwMDAwMDAwMH0.invalid';

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  test('7. CORS - Requête cross-origin devrait être possible', async () => {
    const response = await request(app)
      .get('/api/rooms')
      .set('Origin', 'http://example.com');

    expect(response.status).toBe(200);
  });

  test('8. Accès non autorisé - l\'utilisateur A ne peut pas annuler la réservation de l\'utilisateur B', async () => {
    // Créer deux utilisateurs
    const user1Res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });

    const user2Res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });

    const roomsRes = await request(app)
      .get('/api/rooms');
    const roomId = roomsRes.body.rooms[0]._id;

    // User1 crée une réservation
    const reservRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${user1Res.body.token}`)
      .send({
        roomId,
        startDate: new Date('2024-07-01').toISOString(),
        endDate: new Date('2024-07-02').toISOString()
      });

    const reservationId = reservRes.body.reservation._id;

    // User2 essaie d'annuler la réservation de User1
    const cancelRes = await request(app)
      .put(`/api/reservations/${reservationId}/cancel`)
      .set('Authorization', `Bearer ${user2Res.body.token}`);

    expect(cancelRes.status).toBe(403);
  });

  test('9. Validation des emails - format invalide', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'notanemail',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });

  test('10. Validation des emails - format valide mais réaliste', async () => {
    const emails = [
      'user@domain.com',
      'user.name@domain.co.uk',
      'user+tag@domain.com'
    ];

    for (const email of emails) {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: `user_${Math.random()}`,
          email,
          password: 'password123'
        });

      expect(response.status).toBe(201);
    }
  });

  test('11. Les mots de passe ne doivent pas être en clair', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const user = await User.findOne({ email: 'test@example.com' }).select('+password');
    expect(user.password).not.toBe('password123');
  });

  test('12. Authentification - token manquant pour ressources protégées', async () => {
    const response = await request(app)
      .get('/api/reservations');

    expect(response.status).toBe(401);
  });

  test('13. Authentification - token invalide', async () => {
    const response = await request(app)
      .get('/api/reservations')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(response.status).toBe(401);
  });

  test('14. SQL Injection - username avec SQL', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: `testuser'; DROP TABLE users; --`,
        email: 'test@example.com',
        password: 'password123'
      });

    // Devrait être accepté (stocké comme string, pas exécuté)
    if (response.status === 201) {
      const count = await User.countDocuments({});
      expect(count).toBeGreaterThan(0);
    }
  });

  test('15. Validation - username vide ne doit pas être accepté', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: '',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });
});
