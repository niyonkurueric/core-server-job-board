import { jobSchema } from '../validations/validators.js';
import { ok, fail } from '../utils/response.js';
import jobsService from '../services/jobs.service.js';
import applicationsService from '../services/applications.service.js';

export const listJobs = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = '', location = '' } = req.query;
    const jobs = await jobsService.getAllJobs({
      page: Number(page),
      pageSize: Number(pageSize),
      search,
      location,
    });
    return res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
};

export const listPublishedJobs = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, search = '', location = '' } = req.query;
    const jobs = await jobsService.getAllJobs({
      page: Number(page),
      pageSize: Number(pageSize),
      status: 'published',
      search,
      location,
    });
    return res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await jobsService.getJobById(req.params.id);
    if (!job) return fail(res, 'Job not found', 404);
    return ok(res, job);
  } catch (err) {
    next(err);
  }
};

export const getAllLocations = async (req, res, next) => {
  try {
    const locations = await jobsService.getAllLocations();
    return res.json({ success: true, data: locations });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { error, value } = jobSchema.validate({
      ...req.body,
      status: req.body.status || 'draft',
    });

    if (error) return fail(res, error.details[0].message, 400);

    const payload = {
      ...value,
      status: req.body.status || 'draft',
      created_by: req.user.id,
    };

    const job = await jobsService.createJob(payload);
    return ok(res, job, 201);
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { error, value } = jobSchema.validate(req.body);
    if (error) return fail(res, error.details[0].message, 400);

    const changes = await jobsService.updateJob(req.params.id, value);
    if (!changes) return fail(res, 'Job not found or no changes', 404);
    return ok(res, { id: Number(req.params.id), ...value });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const applications = await applicationsService.getApplicationsByJob(
      req.params.id
    );
    if (applications && applications.length > 0) {
      return fail(
        res,
        'Cannot delete job: at least one user has applied to this job.',
        400
      );
    }
    const changes = await jobsService.deleteJob(req.params.id);
    if (!changes) return fail(res, 'Job not found', 404);
    return ok(res, { id: Number(req.params.id) });
  } catch (err) {
    next(err);
  }
};
