require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./src/models/Room');
const connectDB = require('./src/config/database');

async function seedRooms() {
  try {
    await connectDB();

    // Vérifier si les chambres existent déjà
    const existingRooms = await Room.countDocuments({});
    if (existingRooms > 0) {
      console.log('Les chambres existent déjà');
      process.exit(0);
    }

    const rooms = [
      { name: 'Mercure', capacity: 1, description: 'Petite chambre cozy' },
      { name: 'Vénus', capacity: 1, description: 'Chambre lumineuse' },
      { name: 'Terre', capacity: 1, description: 'Chambre confortable' },
      { name: 'Mars', capacity: 2, description: 'Chambre double standard' },
      { name: 'Jupiter', capacity: 2, description: 'Chambre double deluxe' },
      { name: 'Saturne', capacity: 2, description: 'Chambre double avec vue' },
      { name: 'Uranus', capacity: 4, description: 'Suite familiale spacieuse' },
      { name: 'Neptune', capacity: 4, description: 'Suite avec salon' },
      { name: 'Pluton', capacity: 4, description: 'Suite premium' }
    ];

    await Room.insertMany(rooms);
    console.log('9 chambres créées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

seedRooms();
