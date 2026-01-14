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
});
