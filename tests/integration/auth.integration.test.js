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
  
  // Mock de la connexion MongoDB
  process.env.MONGODB_URI = mongoUri;
  await mongoose.connect(mongoUri);

  // Importer le serveur après la configuration
  app = require('../../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests d\'Intégration - Authentification', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  test('1. Inscription avec données valides', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });

  test('2. Inscription avec email invalide', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'invalidemail',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });

  test('3. Inscription avec mot de passe trop court', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'pass'
      });

    expect(response.status).toBe(400);
  });

  test('4. Inscription avec email existant', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user1',
        email: 'test@example.com',
        password: 'password123'
      });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'user2',
        email: 'test@example.com',
        password: 'password456'
      });

    expect(response.status).toBe(400);
  });

  test('5. Connexion avec identifiants valides', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('6. Connexion avec mot de passe incorrect', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });

  test('7. Connexion avec email inexistant', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notexist@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
  });

  test('8. Récupérer le profil avec token valide', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${signupRes.body.token}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.user.email).toBe('test@example.com');
  });

  test('9. Récupérer le profil sans token', async () => {
    const response = await request(app)
      .get('/api/auth/profile');

    expect(response.status).toBe(401);
  });

  test('10. Récupérer le profil avec token invalide', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
  });
});
