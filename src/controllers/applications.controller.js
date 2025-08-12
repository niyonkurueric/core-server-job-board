import { sendMail } from '../utils/mailer.js';
import { applicationSchema } from '../validations/validators.js';
import { ok, fail } from '../utils/response.js';
import applicationsService from '../services/applications.service.js';

export const listAllApplications = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const rows = await applicationsService.getAllApplications({
      fromDate,
      toDate,
    });
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const apply = async (req, res, next) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message, 400);

    const payload = {
      userId: req.user.id,
      jobId: value.jobId,
      cover_letter: value.cover_letter,
      cv_url: value.cv_url,
    };
    const result = await applicationsService.applyToJob(payload);

    // Fetch job title for email
    let jobTitle = value.jobId;
    try {
      const jobsService = await import('../services/jobs.service.js').then(
        (m) => m.default
      );
      const job = await jobsService.getJobById(value.jobId);
      if (job && job.title) jobTitle = job.title;
    } catch (e) {
      // fallback to jobId if job fetch fails
    }

    // Send email notification (to admin or applicant)
    try {
      await sendMail({
        to: req.user.email,
        subject: 'Application Submitted',
        text: `Your application for job "${jobTitle}" was submitted successfully!`,
        html: `<p>Your application for job <b>${jobTitle}</b> was submitted successfully!</p>`,
      });
    } catch (mailErr) {
      // Log but do not block response
      console.error('Failed to send application email:', mailErr.message);
    }

    return ok(res, result, 201);
  } catch (err) {
    next(err);
  }
};

export const getByJob = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const rows = await applicationsService.getApplicationsByJob(
      req.params.jobId,
      { fromDate, toDate }
    );
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const getMine = async (req, res, next) => {
  try {
    const rows = await applicationsService.getApplicationsByUser(req.user.id);
    return ok(res, rows);
  } catch (err) {
    next(err);
  }
};

export const listJobsWithApplications = async (req, res, next) => {
  try {
    // req.user is already checked by requireAdmin middleware
    const jobs = await import('../services/jobs.service.js').then((m) =>
      m.default.getAllJobs()
    );
    // For each job, get applications
    const jobsWithApps = await Promise.all(
      jobs.map(async (job) => {
        const applications = await applicationsService.getApplicationsByJob(
          job.id
        );
        if (applications && applications.length > 0) {
          return { ...job, applications };
        }
        return null;
      })
    );
    // Filter out jobs with no applications
    const filteredJobs = jobsWithApps.filter((job) => job !== null);
    return ok(res, filteredJobs);
  } catch (err) {
    next(err);
  }
};
