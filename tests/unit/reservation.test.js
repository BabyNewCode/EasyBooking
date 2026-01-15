const Reservation = require('../../src/models/Reservation');
const User = require('../../src/models/User');
const Room = require('../../src/models/Room');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let userId, roomId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Créer un utilisateur et une chambre pour les tests
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  userId = user._id;

  const room = await Room.create({
    name: 'Mercure',
    capacity: 1
  });
  roomId = room._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Tests Unitaires - Modèle Reservation', () => {
  afterEach(async () => {
    await Reservation.deleteMany({});
  });

  test('1. Créer une réservation avec des données valides', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    expect(reservation._id).toBeDefined();
    expect(reservation.status).toBe('confirmed');
  });

  test('2. Date de fin antérieure à la date de début doit lancer une erreur', async () => {
    const startDate = new Date('2024-02-02');
    const endDate = new Date('2024-02-01');

    await expect(
      Reservation.create({
        user: userId,
        room: roomId,
        startDate,
        endDate
      })
    ).rejects.toThrow();
  });

  test('3. Réservation sans utilisateur doit lancer une erreur', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    await expect(
      Reservation.create({
        room: roomId,
        startDate,
        endDate
      })
    ).rejects.toThrow();
  });

  test('4. Réservation sans chambre doit lancer une erreur', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    await expect(
      Reservation.create({
        user: userId,
        startDate,
        endDate
      })
    ).rejects.toThrow();
  });

  test('5. Récupérer les réservations d\'un utilisateur', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    const reservations = await Reservation.find({ user: userId });
    expect(reservations.length).toBe(1);
  });

  test('6. Annuler une réservation', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    await Reservation.findByIdAndUpdate(reservation._id, { status: 'cancelled' });
    const updated = await Reservation.findById(reservation._id);
    expect(updated.status).toBe('cancelled');
  });

  test('7. Supprimer une réservation', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    await Reservation.findByIdAndDelete(reservation._id);
    const found = await Reservation.findById(reservation._id);
    expect(found).toBeNull();
  });

  test('8. Créer plusieurs réservations', async () => {
    const startDate1 = new Date('2024-02-01');
    const endDate1 = new Date('2024-02-02');
    const startDate2 = new Date('2024-02-05');
    const endDate2 = new Date('2024-02-06');

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate: startDate1,
      endDate: endDate1
    });

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate: startDate2,
      endDate: endDate2
    });

    const reservations = await Reservation.find({ user: userId });
    expect(reservations.length).toBe(2);
  });

  test('9. Les réservations doivent avoir une date de création', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    expect(reservation.createdAt).toBeDefined();
    expect(reservation.createdAt instanceof Date).toBe(true);
  });

  test('10. Mettre à jour la date de fin d\'une réservation', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    const newEndDate = new Date('2024-02-05');
    await Reservation.findByIdAndUpdate(reservation._id, { endDate: newEndDate });
    const updated = await Reservation.findById(reservation._id);
    expect(updated.endDate.getTime()).toBe(newEndDate.getTime());
  });

  test('11. Les réservations confirmées doivent être différentes des annulées', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const res1 = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    const res2 = await Reservation.create({
      user: userId,
      room: roomId,
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-02-11')
    });

    await Reservation.findByIdAndUpdate(res2._id, { status: 'cancelled' });

    const confirmed = await Reservation.find({ status: 'confirmed' });
    const cancelled = await Reservation.find({ status: 'cancelled' });

    expect(confirmed.length).toBe(1);
    expect(cancelled.length).toBe(1);
  });

  test('12. Récupérer les réservations par date', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    const reservations = await Reservation.find({
      startDate: { $gte: new Date('2024-01-01') },
      endDate: { $lte: new Date('2024-03-01') }
    });

    expect(reservations.length).toBe(1);
  });

  test('13. Réservation avec status par défaut', async () => {
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-02');

    const reservation = await Reservation.create({
      user: userId,
      room: roomId,
      startDate,
      endDate
    });

    expect(reservation.status).toBe('confirmed');
  });

  test('14. Réservation avec dates identiques doit lancer une erreur', async () => {
    const date = new Date('2024-02-01');

    await expect(
      Reservation.create({
        user: userId,
        room: roomId,
        startDate: date,
        endDate: date
      })
    ).rejects.toThrow();
  });

  test('15. Compter le nombre de réservations d\'un utilisateur', async () => {
    const startDate1 = new Date('2024-02-01');
    const endDate1 = new Date('2024-02-02');
    const startDate2 = new Date('2024-02-05');
    const endDate2 = new Date('2024-02-06');
    const startDate3 = new Date('2024-02-10');
    const endDate3 = new Date('2024-02-11');

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate: startDate1,
      endDate: endDate1
    });

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate: startDate2,
      endDate: endDate2
    });

    await Reservation.create({
      user: userId,
      room: roomId,
      startDate: startDate3,
      endDate: endDate3
    });

    const count = await Reservation.countDocuments({ user: userId });
    expect(count).toBe(3);
  });
});
