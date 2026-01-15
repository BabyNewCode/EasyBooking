const Room = require('../../src/models/Room');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests Unitaires - Modèle Room', () => {
  afterEach(async () => {
    await Room.deleteMany({});
  });

  test('1. Créer une chambre avec des données valides', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1
    });

    expect(room._id).toBeDefined();
    expect(room.name).toBe('Mercure');
    expect(room.capacity).toBe(1);
  });

  test('2. Nom de chambre dupliqué doit lancer une erreur', async () => {
    await Room.create({
      name: 'Mercure',
      capacity: 1
    });

    await expect(
      Room.create({
        name: 'Mercure',
        capacity: 2
      })
    ).rejects.toThrow();
  });

  test('3. Créer une chambre pour chaque planète', async () => {
    const planets = ['Mercure', 'Vénus', 'Terre', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'];
    
    for (const planet of planets) {
      await Room.create({
        name: planet,
        capacity: 1
      });
    }

    const rooms = await Room.find({});
    expect(rooms.length).toBe(9);
  });

  test('4. Capacité invalide doit lancer une erreur', async () => {
    await expect(
      Room.create({
        name: 'Mercure',
        capacity: 5
      })
    ).rejects.toThrow();
  });

  test('5. Récupérer toutes les chambres', async () => {
    await Room.create({ name: 'Mercure', capacity: 1 });
    await Room.create({ name: 'Vénus', capacity: 2 });
    await Room.create({ name: 'Terre', capacity: 4 });

    const rooms = await Room.find({});
    expect(rooms.length).toBe(3);
  });

  test('6. Récupérer une chambre par ID', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1
    });

    const foundRoom = await Room.findById(room._id);
    expect(foundRoom.name).toBe('Mercure');
  });

  test('7. Filtrer les chambres par capacité', async () => {
    await Room.create({ name: 'Mercure', capacity: 1 });
    await Room.create({ name: 'Vénus', capacity: 1 });
    await Room.create({ name: 'Terre', capacity: 2 });

    const roomsCapacity1 = await Room.find({ capacity: 1 });
    expect(roomsCapacity1.length).toBe(2);
  });

  test('8. Mettre à jour la description d\'une chambre', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1,
      description: 'Petite chambre'
    });

    await Room.findByIdAndUpdate(room._id, { description: 'Chambre luxueuse' });
    const updatedRoom = await Room.findById(room._id);
    expect(updatedRoom.description).toBe('Chambre luxueuse');
  });

  test('9. Supprimer une chambre', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1
    });

    await Room.findByIdAndDelete(room._id);
    const foundRoom = await Room.findById(room._id);
    expect(foundRoom).toBeNull();
  });

  test('10. Créer 9 chambres avec les bonnes capacités', async () => {
    const rooms = [
      { name: 'Mercure', capacity: 1 },
      { name: 'Vénus', capacity: 1 },
      { name: 'Terre', capacity: 1 },
      { name: 'Mars', capacity: 2 },
      { name: 'Jupiter', capacity: 2 },
      { name: 'Saturne', capacity: 2 },
      { name: 'Uranus', capacity: 4 },
      { name: 'Neptune', capacity: 4 },
      { name: 'Pluton', capacity: 4 }
    ];

    for (const roomData of rooms) {
      await Room.create(roomData);
    }

    const createdRooms = await Room.find({});
    expect(createdRooms.length).toBe(9);

    const capacity1 = await Room.find({ capacity: 1 });
    const capacity2 = await Room.find({ capacity: 2 });
    const capacity4 = await Room.find({ capacity: 4 });

    expect(capacity1.length).toBe(3);
    expect(capacity2.length).toBe(3);
    expect(capacity4.length).toBe(3);
  });

  test('11. Créer une chambre sans capacité doit lancer une erreur', async () => {
    await expect(
      Room.create({
        name: 'Mercure'
      })
    ).rejects.toThrow();
  });

  test('12. Créer une chambre sans nom doit lancer une erreur', async () => {
    await expect(
      Room.create({
        capacity: 1
      })
    ).rejects.toThrow();
  });

  test('13. Créer une chambre avec une image URL', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1,
      imageUrl: '/images/mercury.jpg'
    });

    expect(room.imageUrl).toBe('/images/mercury.jpg');
  });

  test('14. Créer une chambre avec description', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1,
      description: 'Chambre confortable avec vue'
    });

    expect(room.description).toBe('Chambre confortable avec vue');
  });

  test('15. Les chambres doivent avoir une date de création', async () => {
    const room = await Room.create({
      name: 'Mercure',
      capacity: 1
    });

    expect(room.createdAt).toBeDefined();
    expect(room.createdAt instanceof Date).toBe(true);
  });
});
