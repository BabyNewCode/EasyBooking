const User = require('../../src/backend/models/User');
const bcrypt = require('bcryptjs');

describe('User Model Unit Tests', () => {
  
  describe('User Creation', () => {
    test('Should create a valid user', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = new User(userData);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
    });

    test('Should fail to create user without username', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.username).toBeDefined();
    });

    test('Should fail to create user without email', () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });

    test('Should fail to create user without password', () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    test('Should enforce minimum username length', () => {
      const user = new User({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
    });

    test('Should enforce minimum password length', () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
    });
  });

  describe('Email Validation', () => {
    test('Should reject invalid email format', () => {
      const user = new User({
        username: 'testuser',
        email: 'invalidemail',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });

    test('Should accept valid email formats', () => {
      const emails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com'
      ];
      
      emails.forEach(email => {
        const user = new User({
          username: 'testuser',
          email: email,
          password: 'password123'
        });
        
        const err = user.validateSync();
        expect(err).toBeUndefined();
      });
    });
  });

  describe('Password Methods', () => {
    test('matchPassword should work', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Simulate password hashing
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      
      const isMatch = await user.matchPassword('password123');
      expect(isMatch).toBe(true);
    });

    test('matchPassword should fail with wrong password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      
      const isMatch = await user.matchPassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('toJSON Method', () => {
    test('Should exclude password from JSON', () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.username).toBe('testuser');
      expect(json.email).toBe('test@example.com');
    });
  });

  describe('Email Uniqueness', () => {
    test('Should enforce email uniqueness', () => {
      const user = new User({
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const userDuplicate = new User({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Index validation - schema has unique: true
      expect(user.schema.paths.email.options.unique).toBe(true);
    });
  });

  describe('Username Constraints', () => {
    test('Should enforce username max length', () => {
      const longUsername = 'a'.repeat(31);
      const user = new User({
        username: longUsername,
        email: 'test@example.com',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeDefined();
    });

    test('Should allow username with valid length', () => {
      const user = new User({
        username: 'validusername',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const err = user.validateSync();
      expect(err).toBeUndefined();
    });
  });
});
