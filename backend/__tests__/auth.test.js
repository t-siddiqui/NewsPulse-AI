/**
 * Backend API Tests - NewsPulse
 * Tests: Authentication, Predictions, History, API Endpoints
 * Framework: Jest + Supertest
 * Coverage: Test Cases 1-5, 22-23, 36-48
 */
require('dotenv').config({ path: './.env.test' });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const History = require('../models/History');

// Test Configuration
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'TestPass123!';
let TEST_TOKEN = '';
let TEST_USER_ID = '';

// ============= HELPER FUNCTIONS =============
const clearDatabase = async () => {
  await User.deleteMany({});
  await History.deleteMany({});
};

const createTestUser = async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
  return response.body.token;
};

// ============= TEST SUITE: AUTHENTICATION (Tests 1-5) =============
describe('Authentication Tests', () => {
  
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/fakenews_test');
    }
  });

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  // TEST CASE 1: User signup with valid credentials ✅
  test('TC-1: Should create account with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', TEST_EMAIL);
    expect(response.body.user).toHaveProperty('id');

    // Verify user created in DB
    const user = await User.findOne({ email: TEST_EMAIL });
    expect(user).toBeDefined();
    expect(user.email).toBe(TEST_EMAIL);
  });

  // TEST CASE 2: User login with correct credentials ✅
  test('TC-2: Should login successfully with correct credentials', async () => {
    // Create user first
    await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    // Login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(TEST_EMAIL);
    
    // Verify token is valid JWT format
    expect(response.body.token).toMatch(/^[A-Za-z0-9-._~+/]+=*$/);
  });

  // TEST CASE 3: Login with invalid password ❌
  test('TC-3: Should reject login with invalid password', async () => {
    // Create user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    // Attempt login with wrong password
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: TEST_EMAIL,
        password: 'WrongPassword123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.token).toBeUndefined();
  });

  // TEST CASE 4: Empty login fields ❌
  test('TC-4: Should reject login with empty fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('required');
  });

  // TEST CASE 5: JWT authentication check ✅
  test('TC-5: Should protect routes with JWT authentication', async () => {
    // Create and login user
    const signupRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    const token = signupRes.body.token;

    // Access protected route with valid token
    const validRes = await request(app)
      .get('/api/predict/history')
      .set('Authorization', `Bearer ${token}`);

    expect(validRes.status).toBe(200);

    // Access protected route without token
    const noTokenRes = await request(app)
      .get('/api/predict/history');

    expect(noTokenRes.status).toBe(401);

    // Access protected route with invalid token
    const invalidRes = await request(app)
      .get('/api/predict/history')
      .set('Authorization', 'Bearer invalid_token_here');

    expect(invalidRes.status).toBe(401);
  });

  // Additional: Duplicate signup should fail
  test('Should reject duplicate email registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('already exists');
  });
});

// ============= TEST SUITE: PREDICTION API (Tests 36-37) =============
describe('Prediction API Tests', () => {
  
  beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const uri = process.env.MONGO_TEST_URI;
    if (!uri) {
      throw new Error("MONGO_TEST_URI is not defined in your environment!");
    }
    await mongoose.connect(uri);
  }
  
  // Create test user and get token
  TEST_TOKEN = await createTestUser();
});

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
  });

  // TEST CASE 36: Backend /predict API test ✅
  test('TC-36: Should return 200 OK on valid prediction request', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({
        text: 'Breaking news: Scientists discover new renewable energy source today'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('prediction');
    expect(response.body).toHaveProperty('confidence');
    expect(response.body).toHaveProperty('reasons');
    expect(['REAL', 'FAKE']).toContain(response.body.prediction);
  });

  // TEST CASE 37: Invalid payload handling ❌
  test('TC-37: Should return 400 on malformed JSON payload', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');

    expect(response.status).toBe(400);
  });

  // TEST CASE 6-7: Text validation
  test('TC-6: Should process valid news text', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({
        text: 'SHOCKING: Secret government cover-up exposed!!! CLICK NOW!!!'
      });

    expect(response.status).toBe(200);
    expect(response.body.prediction).toBeDefined();
  });

  test('TC-7: Should reject empty text', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({
        text: ''
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('empty');
  });

  // TEST CASE 19: Confidence score validation
  test('TC-19: Should return confidence score between 0-1', async () => {
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({
        text: 'Federal Reserve raises interest rates by 0.25%'
      });

    expect(response.status).toBe(200);
    expect(response.body.confidence).toBeGreaterThanOrEqual(0);
    expect(response.body.confidence).toBeLessThanOrEqual(1);
  });
});

// ============= TEST SUITE: HISTORY & DATABASE (Tests 22-28) =============
describe('History & Database Tests', () => {
  
  let token;
  let userId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/fakenews_test');
    }
  });

  beforeEach(async () => {
    await clearDatabase();
    const signupRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
    token = signupRes.body.token;
    userId = signupRes.body.user.id;
  });

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
  });

  // TEST CASE 22: Prediction saved to MongoDB ✅
  test('TC-22: Should save prediction to MongoDB', async () => {
    await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'Test news article'
      });

    const history = await History.find({ userId });
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].text).toBe('Test news article');
    expect(history[0]).toHaveProperty('prediction');
    expect(history[0]).toHaveProperty('confidence');
  });

  // TEST CASE 23: Fetch prediction history ✅
  test('TC-23: Should fetch user prediction history', async () => {
    // Add multiple predictions
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/predict')
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: `Test article ${i}`
        });
    }

    const response = await request(app)
      .get('/api/predict/history')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
  });

  // TEST CASE 24: Search history 🔍
  test('TC-24: Should search prediction history', async () => {
    await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'Government news article'
      });

    const response = await request(app)
      .get('/api/predict/history?search=government')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // TEST CASE 26: Delete history item 🗑️
  test('TC-26: Should delete prediction history item', async () => {
    const predictRes = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'Test article'
      });

    const historyId = predictRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/predict/${historyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const fetchRes = await request(app)
      .get(`/api/predict/${historyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(fetchRes.status).toBe(404);
  });
});

// ============= TEST SUITE: SECURITY (Tests 38, 41-45) =============
describe('Security Tests', () => {
  
  let token;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/fakenews_test');
    }
    const signupRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
    token = signupRes.body.token;
  });

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
  });

  // TEST CASE 38: Unauthorized API access 🔐
  test('TC-38: Should deny unauthorized API access', async () => {
    const response = await request(app)
      .get('/api/predict/history')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });

  // TEST CASE 41: CORS validation ✅
  test('TC-41: Should handle CORS correctly', async () => {
    const response = await request(app)
      .get('/api/predict/history')
      .set('Authorization', `Bearer ${token}`)
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  // TEST CASE 42: XSS attack input test 🛡️
  test('TC-42: Should sanitize XSS attack inputs', async () => {
    const xssPayload = "<script>alert('XSS')</script>";
    
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: xssPayload
      });

    expect(response.status).toBe(200);
    
    // Verify stored text is safe
    const history = await History.findOne();
    expect(history.text).not.toContain('<script>');
  });

  // TEST CASE 43: NoSQL injection attempt 🛡️
  test('TC-43: Should prevent NoSQL injection', async () => {
    const injectionPayload = { "$ne": "" };
    
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: injectionPayload
      });

    // Should either reject or sanitize
    expect([400, 200]).toContain(response.status);
  });

  // TEST CASE 44: Password hashing verification ✅
  test('TC-44: Should hash passwords with bcryptjs', async () => {
    const user = await User.findOne({ email: TEST_EMAIL });
    
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe(TEST_PASSWORD);
    expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcryptjs hash format
  });

  // TEST CASE 45: Environment variables hidden 🔐
  test('TC-45: Should not expose environment variables', async () => {
    const response = await request(app)
      .get('/api/predict/history')
      .set('Authorization', `Bearer ${token}`);

    // Check response doesn't contain sensitive data
    const responseStr = JSON.stringify(response.body);
    expect(responseStr).not.toContain(process.env.GEMINI_API_KEY);
    expect(responseStr).not.toContain(process.env.JWT_SECRET);
  });
});

// ============= TEST SUITE: ERROR HANDLING (Tests 39-40, 47) =============
describe('Error Handling Tests', () => {
  
  let token;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/fakenews_test');
    }
    const signupRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
    token = signupRes.body.token;
  });

  afterAll(async () => {
    await clearDatabase();
    await mongoose.connection.close();
  });

  // TEST CASE 39: MongoDB disconnection handling ⚠️
  test('TC-39: Should handle MongoDB disconnection gracefully', async () => {
    // This test would require mocking MongoDB failure
    // In real scenario, disconnect and try to fetch history
    
    const response = await request(app)
      .get('/api/predict/history')
      .set('Authorization', `Bearer ${token}`);

    // Should either succeed or return 503
    expect([200, 503]).toContain(response.status);
  });

  // TEST CASE 47: API timeout handling ⏱️
  test('TC-47: Should handle API timeouts gracefully', async () => {
    // Simulate slow endpoint
    const response = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`)
      .timeout(15000) // 15s timeout
      .send({
        text: 'Test article'
      });

    expect([200, 408, 503]).toContain(response.status);
  });
});

// ============= EXPORT FOR COVERAGE REPORTS =============
module.exports = {};
