#!/usr/bin/env node
/**
 * Script d'initialisation de la base de données
 * Crée les 9 chambres dans MongoDB
 * Usage: node initDb.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Room = require('./src/backend/models/Room');

const rooms = [
  { name: 'Mercure', floor: 1, roomNumber: 1, capacity: 1 },
  { name: 'Vénus', floor: 1, roomNumber: 2, capacity: 1 },
  { name: 'Terre', floor: 1, roomNumber: 3, capacity: 1 },
  { name: 'Mars', floor: 2, roomNumber: 1, capacity: 2 },
  { name: 'Jupiter', floor: 2, roomNumber: 2, capacity: 2 },
  { name: 'Saturne', floor: 2, roomNumber: 3, capacity: 2 },
  { name: 'Uranus', floor: 3, roomNumber: 1, capacity: 4 },
  { name: 'Neptune', floor: 3, roomNumber: 2, capacity: 4 },
  { name: 'Pluton', floor: 3, roomNumber: 3, capacity: 4 }
];

const initDatabase = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connecté à MongoDB');

    console.log('\n🗑️  Suppression des chambres existantes...');
    const deletedCount = await Room.deleteMany({});
    console.log(`✅ ${deletedCount.deletedCount} chambre(s) supprimée(s)`);

    console.log('\n➕ Création des 9 chambres...');
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ ${createdRooms.length} chambres créées avec succès !`);

    console.log('\n📋 Chambres dans la base de données:');
    createdRooms.forEach((room, index) => {
      console.log(`  ${index + 1}. ${room.name} (Étage ${room.floor}, Capacité: ${room.capacity} personne(s))`);
    });

    // Vérifier que les chambres ont bien été créées
    console.log('\n🔍 Vérification...');
    const roomsInDb = await Room.find();
    console.log(`✅ ${roomsInDb.length} chambre(s) trouvée(s) dans la base de données`);

    await mongoose.connection.close();
    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('💡 Vous pouvez maintenant lancer: npm start');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

initDatabase();
