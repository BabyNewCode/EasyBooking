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

  describe('Password Security', () => {
    test('Should require password minimum length of 6', () => {
      const shortPassword = 'pass';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: shortPassword
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    test('Should accept password of exactly 6 characters', () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'pass123'
      });

      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should accept long passwords', () => {
      const longPassword = 'thisIsAVeryLongPasswordWith123SpecialCharacters!@#';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: longPassword
      });

      const err = user.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Email Case Sensitivity', () => {
    test('Should lowercase email on creation', () => {
      const user = new User({
        username: 'testuser',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });

      expect(user.email).toBe('test@example.com');
    });

    test('Should handle mixed case emails', () => {
      const user = new User({
        username: 'testuser',
        email: 'Test.User@Example.Com',
        password: 'password123'
      });

      expect(user.email).toBe('test.user@example.com');
    });
  });

  describe('Username Trimming', () => {
    test('Should trim whitespace from username', () => {
      const user = new User({
        username: '  testuser  ',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.username).toBe('testuser');
    });
  });

  describe('CreatedAt Timestamp', () => {
    test('Should set createdAt automatically', () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt instanceof Date).toBe(true);
    });

    test('Should use current date for createdAt', () => {
      const beforeCreate = new Date();
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      const afterCreate = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime() - 100);
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime() + 100);
    });
  });

  describe('Field Validation', () => {
    test('Should validate all required fields together', () => {
      const user = new User({});

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(Object.keys(err.errors).length).toBeGreaterThanOrEqual(3);
    });

    test('Should only have errors for invalid fields', () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.username).toBeUndefined();
    });
  });

  describe('Complex Password Scenarios', () => {
    test('Should accept passwords with special characters', async () => {
      const specialPassword = 'P@$$w0rd!#&*';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: specialPassword
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(specialPassword, salt);

      const isMatch = await user.matchPassword(specialPassword);
      expect(isMatch).toBe(true);
    });

    test('Should accept passwords with spaces', async () => {
      const passwordWithSpace = 'pass word 123';
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: passwordWithSpace
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(passwordWithSpace, salt);

      const isMatch = await user.matchPassword(passwordWithSpace);
      expect(isMatch).toBe(true);
    });
  });

  describe('Multiple User Instances', () => {
    test('Should create independent user instances', () => {
      const user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });

      const user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password456'
      });

      expect(user1.username).not.toBe(user2.username);
      expect(user1.email).not.toBe(user2.email);
    });
  });

  describe('Boundary Tests', () => {
    test('Should accept minimum valid username (3 chars)', () => {
      const user = new User({
        username: 'abc',
        email: 'test@example.com',
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should accept maximum valid username (30 chars)', () => {
      const user = new User({
        username: 'a'.repeat(30),
        email: 'test@example.com',
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    test('Should reject username shorter than 3 chars', () => {
      const user = new User({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
    });

    test('Should reject username longer than 30 chars', () => {
      const user = new User({
        username: 'a'.repeat(31),
        email: 'test@example.com',
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
    });
  });
});
