const jwt = require('jsonwebtoken');

describe('JWT Authentication Unit Tests', () => {
  const JWT_SECRET = 'test_jwt_secret_key';
  const JWT_EXPIRE = '7d';

  describe('Token Generation', () => {
    test('Should generate valid JWT token', () => {
      const userId = '123456789';
      const token = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    test('Should generate different tokens for different users', () => {
      const token1 = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
      const token2 = jwt.sign({ id: '456' }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      expect(token1).not.toBe(token2);
    });

    test('Should embed user id in token', () => {
      const userId = 'user123';
      const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      const decoded = jwt.verify(token, JWT_SECRET);
      expect(decoded.id).toBe(userId);
    });
  });

  describe('Token Verification', () => {
    test('Should verify valid token', () => {
      const userId = '123456789';
      const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).not.toThrow();
    });

    test('Should reject token with wrong secret', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      expect(() => {
        jwt.verify(token, 'wrong_secret');
      }).toThrow();
    });

    test('Should reject malformed token', () => {
      const malformedToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(malformedToken, JWT_SECRET);
      }).toThrow();
    });

    test('Should reject empty token', () => {
      expect(() => {
        jwt.verify('', JWT_SECRET);
      }).toThrow();
    });
  });

  describe('Token Expiration', () => {
    test('Should create token with correct expiration', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    test('Should reject expired token', (done) => {
      // Create token that expires immediately
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '0s' });

      // Wait a bit and try to verify
      setTimeout(() => {
        expect(() => {
          jwt.verify(token, JWT_SECRET);
        }).toThrow();
        done();
      }, 100);
    });
  });

  describe('Token Payload', () => {
    test('Should include user id in payload', () => {
      const userId = 'user123';
      const token = jwt.sign({ id: userId }, JWT_SECRET);
      const decoded = jwt.decode(token);

      expect(decoded.id).toBe(userId);
    });

    test('Should handle complex payload', () => {
      const payload = {
        id: 'user123',
        email: 'test@example.com',
        role: 'admin'
      };
      const token = jwt.sign(payload, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });
});
