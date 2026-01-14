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

  describe('Token Security', () => {
    test('Should not allow token modification', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET);
      const parts = token.split('.');

      // Modify payload
      const tamperedToken = parts[0] + '.eyJpZCI6IjQ1NiJ9.' + parts[2];

      expect(() => {
        jwt.verify(tamperedToken, JWT_SECRET);
      }).toThrow();
    });

    test('Should require secret for token generation', () => {
      const token1 = jwt.sign({ id: '123' }, JWT_SECRET);
      const token2 = jwt.sign({ id: '123' }, 'different_secret');

      expect(token1).not.toBe(token2);
    });

    test('Should handle token with algorithm specification', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { algorithm: 'HS256' });

      expect(() => {
        jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      }).not.toThrow();
    });
  });

  describe('Token Decoding without Verification', () => {
    test('Should decode token without verification', () => {
      const userId = 'user456';
      const token = jwt.sign({ id: userId }, JWT_SECRET);
      const decoded = jwt.decode(token);

      // decode doesn't verify
      expect(decoded.id).toBe(userId);
    });

    test('Should return null for invalid tokens without throwing', () => {
      const decoded = jwt.decode('invalid.token');

      expect(decoded).toBeNull();
    });
  });

  describe('Multi-User Token Generation', () => {
    test('Should generate unique tokens for multiple users', () => {
      const tokens = new Set();

      for (let i = 0; i < 10; i++) {
        const token = jwt.sign({ id: `user${i}` }, JWT_SECRET);
        tokens.add(token);
      }

      expect(tokens.size).toBe(10);
    });

    test('Should track user id correctly for multiple tokens', () => {
      const users = ['user1', 'user2', 'user3'];
      const tokenMap = {};

      users.forEach(userId => {
        tokenMap[userId] = jwt.sign({ id: userId }, JWT_SECRET);
      });

      Object.entries(tokenMap).forEach(([userId, token]) => {
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.id).toBe(userId);
      });
    });
  });

  describe('Token Standard Claims', () => {
    test('Should include issued-at claim', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET);
      const decoded = jwt.decode(token);

      expect(decoded.iat).toBeDefined();
      expect(typeof decoded.iat).toBe('number');
    });

    test('Should include expiration claim', () => {
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '24h' });
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    test('Should validate token timestamps', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.decode(token);

      expect(decoded.iat).toBeLessThanOrEqual(now + 1);
      expect(decoded.exp).toBeGreaterThan(now);
    });
  });

  describe('Concurrent Token Operations', () => {
    test('Should handle concurrent token generation', async () => {
      const promises = Array(20).fill(null).map((_, i) =>
        Promise.resolve(jwt.sign({ id: `user${i}` }, JWT_SECRET))
      );

      const tokens = await Promise.all(promises);

      expect(tokens.length).toBe(20);
      expect(new Set(tokens).size).toBe(20);
    });

    test('Should verify multiple tokens concurrently', async () => {
      const tokens = Array(10).fill(null).map((_, i) =>
        jwt.sign({ id: `user${i}` }, JWT_SECRET)
      );

      const verifyPromises = tokens.map(token =>
        Promise.resolve(jwt.verify(token, JWT_SECRET))
      );

      const results = await Promise.all(verifyPromises);

      expect(results.length).toBe(10);
      results.forEach((decoded, i) => {
        expect(decoded.id).toBe(`user${i}`);
      });
    });
  });
});
