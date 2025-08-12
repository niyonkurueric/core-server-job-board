import request from 'supertest';
import app from '../src/app.js';

describe('Jobs Endpoints', () => {
  it('should fetch all jobs (public)', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch a single job (public)', async () => {
    // First, get a job id
    const jobsRes = await request(app).get('/api/jobs');
    const job = jobsRes.body.data[0];
    if (!job) return;
    const res = await request(app).get(`/api/jobs/${job.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(job.id);
  });
});
