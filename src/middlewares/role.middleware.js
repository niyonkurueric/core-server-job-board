export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied: ${role} privileges required`,
        error: 'You do not have permission to access this resource.',
      });
    }
    next();
  };
}
