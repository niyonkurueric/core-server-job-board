import openDb from '../config/db.vercel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async ({ email, password, role = 'user' }) => {
  const db = await openDb();
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await db.run(
      `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
      [email, hashed, role]
    );
    await db.close();
    return { id: result.lastID, email, role };
  } catch (err) {
    await db.close();
    throw err;
  }
};

export const login = async ({ email, password }) => {
  const db = await openDb();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  await db.close();
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  };
};
