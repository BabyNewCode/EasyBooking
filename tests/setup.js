const mongoose = require('mongoose');

beforeAll(async () => {
  // Configuration pour les tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key';
});

afterAll(async () => {
  // Fermer la connexion MongoDB
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (e) {
    // Ignorer les erreurs de déconnexion
  }
});
