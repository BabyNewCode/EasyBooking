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

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB');

    // Supprimer les chambres existantes
    await Room.deleteMany({});
    console.log('🗑️  Chambres existantes supprimées');

    // Ajouter les 9 nouvelles chambres
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ ${createdRooms.length} chambres créées avec succès !`);

    // Afficher les chambres créées
    console.log('\n📋 Chambres dans la base de données:');
    createdRooms.forEach(room => {
      console.log(`  - ${room.name} (Étage ${room.floor}, Capacité: ${room.capacity} personne(s))`);
    });

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n✅ Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedDatabase();
