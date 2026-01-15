const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

// Route pour servir le fichier HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour les pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rooms.html'));
});

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reservations.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

const PORT = process.env.PORT || 3000;

// Connexion à la base de données et démarrage du serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
});

module.exports = app;
