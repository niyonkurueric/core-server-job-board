export default function errorMiddleware(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  let message = 'Internal Server Error';
  if (
    err.isJoi ||
    (err.details &&
      Array.isArray(err.details) &&
      err.details[0] &&
      err.details[0].message)
  ) {
    message = err.details[0].message;
  } else if (err.message) {
    message = err.message;
  }
  res.status(status).json({ success: false, message });
}
