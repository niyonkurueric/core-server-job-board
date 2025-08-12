export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, data });
export const fail = (res, message = 'Error', status = 400) =>
  res.status(status).json({ success: false, message });
