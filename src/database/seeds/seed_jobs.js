import db from '../../config/db.vercel.js';
import dotenv from 'dotenv';
dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

const seedJobs = async () => {
  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (err || !row) {
      console.error('Admin user not found. Seed admin first.');
      db.close();
      return;
    }
    const adminId = row.id;
    db.run(
      `INSERT INTO jobs (title, description, company, location, deadline, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Sample Job',
        'This is a sample job description.',
        'Sample Company',
        'Sample Location',
        '2025-12-31',
        'published',
        adminId,
      ],
      (err) => {
        if (err) {
          console.error('Failed to seed job:', err.message);
        } else {
          console.log('Sample job seeded');
        }
        db.close();
      }
    );
  });
};

seedJobs();
