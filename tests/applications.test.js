import request from 'supertest';
import app from '../src/app.js';

describe('Applications Endpoints', () => {
  let token;
  let jobId;

  beforeAll(async () => {
    // Register and login a user
    await request(app).post('/api/auth/register').send({
      name: 'Applicant',
      email: 'applicant@example.com',
      password: 'applicantpass',
    });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'applicant@example.com', password: 'applicantpass' });
    token = loginRes.body.data.token;
    // Get a job id
    const jobsRes = await request(app).get('/api/jobs');
    jobId = jobsRes.body.data[0]?.id;
  });

  it('should submit a job application', async () => {
    if (!jobId) return;
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jobId,
        cover_letter: 'My cover letter',
        cv_url: 'https://example.com/cv.pdf',
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.success).toBe(true);
  });

  it('should fetch my applications', async () => {
    const res = await request(app)
      .get('/api/applications/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
