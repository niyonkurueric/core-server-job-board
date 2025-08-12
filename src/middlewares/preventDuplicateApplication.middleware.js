import applicationsService from '../services/applications.service.js';

export const preventDuplicateApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.body.jobId;
    if (!userId || !jobId) {
      return res
        .status(400)
        .json({ message: 'Missing user or job information.' });
    }
    const userApplications =
      await applicationsService.getApplicationsByUser(userId);
    const alreadyApplied = userApplications.some((app) => app.jobId === jobId);
    if (alreadyApplied) {
      return res
        .status(409)
        .json({ message: 'You have already applied for this job.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
