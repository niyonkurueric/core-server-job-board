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

    // Send email notification to applicant
    try {
      await sendMail({
        to: req.user.email,
        subject: 'Application Submitted Successfully',
        text: `Your application for job "${jobTitle}" was submitted successfully! We will review your application and get back to you soon.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Application Submitted Successfully!</h2>
            <p>Dear ${req.user.name || 'Applicant'},</p>
            <p>Your application for the position of <strong>${jobTitle}</strong> has been submitted successfully.</p>
            <p>We will review your application and get back to you within 3-5 business days.</p>
            <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
            <p style="color: #7f8c8d; font-size: 14px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `,
      });
      console.log(`✅ Application confirmation email sent to ${req.user.email}`);
    } catch (mailErr) {
      console.error('Failed to send application confirmation email:', mailErr.message);
    }

    // Send notification email to admin (if admin email is configured)
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      if (adminEmail && adminEmail !== req.user.email) {
        await sendMail({
          to: adminEmail,
          subject: `New Job Application: ${jobTitle}`,
          text: `A new application has been submitted for the job "${jobTitle}" by ${req.user.name || req.user.email}.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e74c3c;">New Job Application Received</h2>
              <p><strong>Job:</strong> ${jobTitle}</p>
              <p><strong>Applicant:</strong> ${req.user.name || 'N/A'} (${req.user.email})</p>
              <p><strong>Applied:</strong> ${new Date().toLocaleString()}</p>
              <hr style="border: 1px solid #ecf0f1; margin: 20px 0;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Review this application in your admin dashboard.
              </p>
            </div>
          `,
        });
        console.log(`✅ Admin notification email sent to ${adminEmail}`);
      }
    } catch (mailErr) {
      console.error('Failed to send admin notification email:', mailErr.message);
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
