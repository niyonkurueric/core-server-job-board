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
});

export const applicationSchema = Joi.object({
  jobId: Joi.number().integer().required(),
  cover_letter: Joi.string().max(10000).allow('', null), // allow long HTML/text
  cv_url: Joi.string().uri().allow('', null),
});
