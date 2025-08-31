import request from 'supertest';
import app from '../src/app.js';

describe('Health & Info Endpoints', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
  });

  it('should return CORS headers', async () => {
    const res = await request(app).options('/api/jobs');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });
});
