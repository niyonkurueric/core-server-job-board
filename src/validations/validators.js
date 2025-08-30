import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const jobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  company: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  status: Joi.string().valid('draft', 'published', 'approved').default('draft'),
  deadline: Joi.date().iso().required().messages({
    'any.required': 'Job deadline (end date) is required',
    'date.base': 'Job deadline must be a valid date',
    'date.format': 'Job deadline must be in ISO format (YYYY-MM-DD)',
  }),
});

export const applicationSchema = Joi.object({
  jobId: Joi.number().integer().required(),
  cover_letter: Joi.string().max(50000).allow('', null).messages({
    'string.max': 'Cover letter must be at most 50,000 characters',
  }),
  cv_url: Joi.string().uri().allow('', null),
});
