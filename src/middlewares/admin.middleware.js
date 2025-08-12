export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: admin privileges required',
      error: 'You do not have permission to access this resource.',
    });
  }
  next();
}
