import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Job Board API',
    version: '1.0.0',
    description: 'API documentation for the Job Board project',
  },
  servers: [
    // Use the current host and port from .env or default
    { url: `http://localhost:${process.env.PORT || 5000}` },
    { url: '/' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: "Register a new user (role is always 'user')",
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered' },
          400: { description: 'Invalid input' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/api/auth/users': {
      get: {
        summary: 'List all users (admin only)',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of users' },
          403: { description: 'Forbidden' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login with email and password',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Successful login' },
          400: { description: 'Missing or invalid credentials' },
          401: { description: 'Authentication failed' },
        },
      },
    },
    '/api/auth/google': {
      post: {
        summary: 'Login with Google (Firebase ID token)',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  idToken: {
                    type: 'string',
                    description: 'Firebase ID token from Google login',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Successful login' },
          400: { description: 'Missing or invalid idToken' },
          401: { description: 'Authentication failed' },
        },
      },
    },
    '/api/jobs': {
      get: {
        summary: 'List all jobs',
        tags: ['Jobs'],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination',
          },
          {
            in: 'query',
            name: 'pageSize',
            schema: { type: 'integer', default: 10 },
            description: 'Number of jobs per page',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search jobs by title',
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' },
            description: 'Filter jobs by location',
          },
        ],
        responses: {
          200: { description: 'List of jobs' },
        },
      },
      post: {
        summary: 'Create a new job (admin only)',
        tags: ['Jobs'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  company: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Job created' },
          400: { description: 'Invalid input' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/jobs/{id}': {
      get: {
        summary: 'Get job by ID',
        tags: ['Jobs'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Job found' },
          404: { description: 'Job not found' },
        },
      },
      put: {
        summary: 'Update a job (admin only)',
        tags: ['Jobs'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  company: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Job updated' },
          400: { description: 'Invalid input' },
          403: { description: 'Forbidden' },
          404: { description: 'Job not found' },
        },
      },
      delete: {
        summary: 'Delete a job (admin only)',
        tags: ['Jobs'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Job deleted' },
          403: { description: 'Forbidden' },
          404: { description: 'Job not found' },
        },
      },
    },
    '/api/applications': {
      post: {
        summary: 'Apply to a job (authenticated user)',
        tags: ['Applications'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  jobId: { type: 'integer' },
                  cover_letter: { type: 'string' },
                  cv_url: {
                    type: 'string',
                    description: 'Link to CV file (optional)',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Application submitted' },
          400: { description: 'Invalid input' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/applications/me': {
      get: {
        summary: 'Get my applications (authenticated user)',
        tags: ['Applications'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of my applications' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/applications/job/{jobId}': {
      get: {
        summary: 'List applications for a job (admin only)',
        tags: ['Applications'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'jobId',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'List of applications for the job' },
          403: { description: 'Forbidden' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/jobs-applications': {
      get: {
        summary: 'List all jobs with their applications (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of jobs with applications' },
          403: { description: 'Forbidden' },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
