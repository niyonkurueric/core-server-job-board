import db from '../../config/db.vercel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const adminName = process.env.ADMIN_NAME || 'Admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const seed = async () => {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  db.serialize(() => {
    db.run('DELETE FROM users', [], (err) => {
      if (err) {
        console.error('Failed to delete users:', err.message);
        db.close();
        return;
      }
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Seed failed:', err.message);
          } else {
            console.log('Admin user seeded');
          }
          db.close();
        }
      );
    });
  });
};

seed();
