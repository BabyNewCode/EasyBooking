const User = require('../../src/models/User');
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

describe('Tests Unitaires - Modèle User', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  test('1. Créer un utilisateur avec des données valides', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(user._id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  test('2. Le mot de passe doit être hashé', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const savedUser = await User.findById(user._id).select('+password');
    expect(savedUser.password).not.toBe('password123');
  });

  test('3. Email dupliqué doit lancer une erreur', async () => {
    await User.create({
      username: 'user1',
      email: 'test@example.com',
      password: 'password123'
    });

    await expect(
      User.create({
        username: 'user2',
        email: 'test@example.com',
        password: 'password456'
      })
    ).rejects.toThrow();
  });

  test('4. Username dupliqué doit lancer une erreur', async () => {
    await User.create({
      username: 'testuser',
      email: 'test1@example.com',
      password: 'password123'
    });

    await expect(
      User.create({
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password456'
      })
    ).rejects.toThrow();
  });

  test('5. Email manquant doit lancer une erreur', async () => {
    await expect(
      User.create({
        username: 'testuser',
        password: 'password123'
      })
    ).rejects.toThrow();
  });

  test('6. Username manquant doit lancer une erreur', async () => {
    await expect(
      User.create({
        email: 'test@example.com',
        password: 'password123'
      })
    ).rejects.toThrow();
  });

  test('7. Password manquant doit lancer une erreur', async () => {
    await expect(
      User.create({
        username: 'testuser',
        email: 'test@example.com'
      })
    ).rejects.toThrow();
  });

  test('8. Email invalide doit lancer une erreur', async () => {
    await expect(
      User.create({
        username: 'testuser',
        email: 'invalidemail',
        password: 'password123'
      })
    ).rejects.toThrow();
  });

  test('9. La méthode matchPassword retourne true pour un mot de passe correct', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const userWithPassword = await User.findById(user._id).select('+password');
    const isMatch = await userWithPassword.matchPassword('password123');
    expect(isMatch).toBe(true);
  });

  test('10. La méthode matchPassword retourne false pour un mot de passe incorrect', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const userWithPassword = await User.findById(user._id).select('+password');
    const isMatch = await userWithPassword.matchPassword('wrongpassword');
    expect(isMatch).toBe(false);
  });

  test('11. Username avec moins de 3 caractères doit lancer une erreur', async () => {
    await expect(
      User.create({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      })
    ).rejects.toThrow();
  });

  test('12. Récupérer un utilisateur par ID', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const foundUser = await User.findById(user._id);
    expect(foundUser.username).toBe('testuser');
    expect(foundUser.email).toBe('test@example.com');
  });

  test('13. Mettre à jour un utilisateur', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    await User.findByIdAndUpdate(user._id, { username: 'newusername' });
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).toBe('newusername');
  });

  test('14. Supprimer un utilisateur', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    await User.findByIdAndDelete(user._id);
    const foundUser = await User.findById(user._id);
    expect(foundUser).toBeNull();
  });

  test('15. Créer plusieurs utilisateurs', async () => {
    await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123'
    });

    await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password456'
    });

    const users = await User.find({});
    expect(users.length).toBe(2);
  });
});
