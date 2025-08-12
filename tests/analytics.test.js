import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Helper to get a valid admin JWT (matches seeded admin user)
function getAdminToken() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  // id: 1 matches the seeded admin user
  return jwt.sign(
    { id: 1, email: adminEmail, name: adminName, role: 'admin' },
    process.env.JWT_SECRET || 'test',
    { expiresIn: '1h' }
  );
}

describe('Analytics Endpoint', () => {
  it('should return analytics data for admin', async () => {
    const token = getAdminToken();
    const res = await request(app)
      .get('/api/analytics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('users');
    expect(res.body.data).toHaveProperty('jobs');
    expect(res.body.data).toHaveProperty('applications');
    expect(res.body.data).toHaveProperty('jobsPostedLast6Months');
    expect(res.body.data).toHaveProperty('applicationsReceivedLast6Months');
    // All should be numbers
    Object.values(res.body.data).forEach((val) =>
      expect(typeof val).toBe('number')
    );
  });

  it('should deny analytics to non-admin', async () => {
    // Simulate a user token
    const userToken = jwt.sign(
      { id: 2, email: 'user@example.com', role: 'user' },
      process.env.JWT_SECRET || 'test',
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get('/api/analytics')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
