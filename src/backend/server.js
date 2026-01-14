require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/database');

// Connect to database
connectDB().catch(err => {
  console.warn('Impossible de se connecter à MongoDB:', err.message);
});

const app = express();
const pagesPath = path.join(__dirname, '../../src/frontend/pages');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('src/frontend'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Serve HTML pages explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'register.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'login.html'));
});

app.get('/rooms.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'rooms.html'));
});

app.get('/reservations.html', (req, res) => {
  res.sendFile(path.join(pagesPath, 'reservations.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Accédez à http://localhost:${PORT}\n`);
});

module.exports = app;
