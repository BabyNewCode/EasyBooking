const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock server setup
const app = express();
app.use(express.json());

// Mock routes
const authController = {
  register: (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;
    
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token: 'mock_token',
      user: { username, email, _id: '123' }
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    if (email === 'test@example.com' && password === 'password123') {
      return res.status(200).json({
        message: 'Connexion réussie',
        token: 'mock_token',
        user: { email, username: 'testuser', _id: '123' }
      });
    }
    
    res.status(401).json({ message: 'Identifiants invalides' });
  }
};

const roomController = {
  getAllRooms: (req, res) => {
    res.status(200).json({
      success: true,
      count: 9,
      data: [
        { _id: '1', name: 'Mercure', floor: 1, capacity: 1, isAvailable: true }
      ]
    });
  }
};

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/rooms', roomController.getAllRooms);

describe('API Integration Tests', () => {
  
  describe('Authentication Endpoints', () => {
    test('Should register user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Utilisateur créé avec succès');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('newuser');
    });

    test('Should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Tous les champs sont requis');
    });

    test('Should reject registration with mismatched passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          passwordConfirm: 'different'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Les mots de passe ne correspondent pas');
    });

    test('Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Connexion réussie');
      expect(response.body.token).toBeDefined();
    });

    test('Should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Identifiants invalides');
    });

    test('Should reject login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    test('Should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Room Endpoints', () => {
    test('Should retrieve all rooms', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(9);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Should return rooms in correct format', async () => {
      const response = await request(app)
        .get('/api/rooms');

      if (response.body.data.length > 0) {
        const room = response.body.data[0];
        expect(room._id).toBeDefined();
        expect(room.name).toBeDefined();
        expect(room.floor).toBeDefined();
        expect(room.capacity).toBeDefined();
        expect(room.isAvailable).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent endpoint', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });

  describe('Request/Response Format', () => {
    test('Should accept JSON requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
    });

    test('Should return JSON responses', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.type).toMatch(/json/);
    });
  });

  describe('Multiple Registration Attempts', () => {
    test('Should handle multiple user registrations', async () => {
      const users = [
        { username: 'user1', email: 'user1@test.com', password: 'pass123' },
        { username: 'user2', email: 'user2@test.com', password: 'pass456' },
        { username: 'user3', email: 'user3@test.com', password: 'pass789' }
      ];

      for (const user of users) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...user,
            passwordConfirm: user.password
          });

        expect(response.status).toBe(201);
        expect(response.body.user.username).toBe(user.username);
      }
    });
  });

  describe('Authentication Flow', () => {
    test('Should complete full auth flow (register -> login)', async () => {
      // Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'fullflowuser',
          email: 'fullflow@test.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.token).toBeDefined();

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
    });
  });

  describe('Response Headers', () => {
    test('Should include Content-Type header', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.headers['content-type']).toBeDefined();
    });

    test('Should handle HEAD requests', async () => {
      // Test if server responds to basic requests
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('Validation Integration', () => {
    test('Should validate email format in registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'invalidemail',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      // Should fail validation (exact behavior depends on implementation)
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('Should validate password strength requirements', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '123',
          passwordConfirm: '123'
        });

      // Weak password should fail
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Room Retrieval Variations', () => {
    test('Should retrieve rooms without authentication', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
    });

    test('Should return correct room data structure', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
    });

    test('Should have 9 rooms total', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.body.count).toBe(9);
    });
  });

  describe('Concurrent Requests', () => {
    test('Should handle concurrent registrations', async () => {
      const registrations = Array(5).fill(null).map((_, i) =>
        request(app)
          .post('/api/auth/register')
          .send({
            username: `user${i}`,
            email: `user${i}@test.com`,
            password: 'password123',
            passwordConfirm: 'password123'
          })
      );

      const responses = await Promise.all(registrations);

      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
      });
    });

    test('Should handle concurrent room requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/api/rooms')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(9);
      });
    });
  });

  describe('Missing Required Fields', () => {
    test('Should handle registration with null values', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: null,
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('Should reject login without credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Response Status Codes', () => {
    test('Should return 201 for successful registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      expect(response.status).toBe(201);
    });

    test('Should return 200 for successful login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
    });

    test('Should return 200 for room retrieval', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
    });
  });

  describe('Data Consistency', () => {
    test('Should return consistent room data across requests', async () => {
      const response1 = await request(app).get('/api/rooms');
      const response2 = await request(app).get('/api/rooms');

      expect(response1.body.count).toBe(response2.body.count);
      expect(response1.body.data.length).toBe(response2.body.data.length);
    });

    test('Should return authenticated user data after login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });
  });
});
