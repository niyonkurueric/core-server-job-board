import openDb from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyFirebaseToken } from './firebase.service.js';

export const register = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    openDb.get(`SELECT id FROM users WHERE email = ?`, [email], (err, user) => {
      if (err) return reject(err);
      if (user) {
        return reject(new Error('User with this email already exists'));
      }
      openDb.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hashed, 'user'],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, name, email, role: 'user' });
        }
      );
    });
  });
};

export const login = async ({ email, password, idToken }) => {
  if (idToken) {
    try {
      const decoded = await verifyFirebaseToken(idToken);
      return new Promise((resolve, reject) => {
        openDb.get(
          `SELECT * FROM users WHERE email = ?`,
          [decoded.email],
          async (err, user) => {
            if (err) return reject(err);
            if (!user) {
              openDb.run(
                `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
                [decoded.email, '', 'user'],
                function (err) {
                  if (err) return reject(err);
                  const token = jwt.sign(
                    { id: this.lastID, email: decoded.email, role: 'user' },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                    }
                  );
                  resolve({
                    token,
                    user: {
                      id: this.lastID,
                      email: decoded.email,
                      role: 'user',
                    },
                  });
                }
              );
            } else {
              const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                {
                  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                }
              );
              resolve({
                token,
                user: {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  name: user.name,
                },
              });
            }
          }
        );
      });
    } catch (err) {
      throw new Error('Invalid Firebase token');
    }
  }
  // Manual login
  return new Promise((resolve, reject) => {
    openDb.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      async (err, user) => {
        if (err) return reject(err);
        if (!user) return reject(new Error('Invalid credentials'));
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return reject(new Error('Invalid credentials'));
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
          }
        );
        resolve({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        });
      }
    );
  });
};
