import request from 'supertest';
import app from '../src/app.js';

describe('Auth Endpoints', () => {
  // Skip Google login test if present
  // it('should login with Google', async () => { /* skipped for CI */ });
  it('should register a new user (success or duplicate)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpass123',
    });
    if (res.statusCode === 201) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('testuser@example.com');
    } else {
      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/exists/);
    }
  });

  it('should fail registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: '', password: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should fail registration with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad', email: 'notanemail', password: 'testpass123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should login with correct credentials (success)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'testpass123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('should fail login with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should fail login with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notanemail', password: 'testpass123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
