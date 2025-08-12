import openDb from '../config/db.js';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validations/validators.js';
import { ok, fail } from '../utils/response.js';

function extractErrorMessage(err, fallback = 'Invalid input') {
  if (!err) return fallback;
  if (
    err.details &&
    Array.isArray(err.details) &&
    err.details[0] &&
    err.details[0].message
  ) {
    return err.details[0].message;
  }
  if (err.message) return err.message;
  return fallback;
}

// List all users (admin only)
export const listUsers = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: admin privileges required',
        error: 'You do not have permission to access this resource.',
      });
    }
    openDb.all(
      'SELECT id, name, email, role, created_at FROM users',
      [],
      (err, rows) => {
        if (err) return next(err);
        res.json({ success: true, data: rows });
      }
    );
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: extractErrorMessage(error) });
    }
    const result = await authService.register(value);
    return ok(res, result, 201);
  } catch (err) {
    let status = 400;
    let message = extractErrorMessage(err, 'Registration failed');
    if (err.message && err.message.includes('UNIQUE')) {
      message = 'email already exists';
      status = 409;
    }
    return res.status(status).json({ success: false, message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: extractErrorMessage(error) });
    }
    const result = await authService.login(req.body);
    return ok(res, result);
  } catch (err) {
    let status = 400;
    let message = extractErrorMessage(err, 'Login failed');
    if (err.message && err.message.toLowerCase().includes('credentials')) {
      status = 401;
    }
    return res.status(status).json({ success: false, message });
  }
};

// Google login controller
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return fail(res, 'idToken required', 400);
    const result = await authService.login({ idToken });
    return ok(res, result);
  } catch (err) {
    return fail(res, err.message || 'Google login failed', 401);
  }
};
