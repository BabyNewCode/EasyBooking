// Setup file for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRE = '7d';
process.env.MONGODB_URI = 'mongodb+srv://testuser:testpass@localhost/easybooking_test';

// Increase test timeout for slower operations
jest.setTimeout(10000);
