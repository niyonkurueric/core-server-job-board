## Analytics Endpoint

Admins can access project analytics at:

```
GET /api/analytics
Authorization: Bearer <admin-jwt-token>
```

**Returns:**

- `users`: Total users
- `jobs`: Total jobs
- `applications`: Total applications
- `jobsPostedLast6Months`: Jobs posted in the last 6 months
- `applicationsReceivedLast6Months`: Applications received in the last 6 months

**Example Response:**

```json
{
  "success": true,
  "data": {
    "users": 10,
    "jobs": 5,
    "applications": 20,
    "jobsPostedLast6Months": 3,
    "applicationsReceivedLast6Months": 8
  }
}
```

# Job Board Portal

Welcome to the Job Board Portal backend! This project provides a robust, secure, and scalable API for managing job postings, applications, and user authentication for both administrators and job seekers.

## Features

- **User Registration & Login**: Secure authentication with JWT, including Google login support.
- **Role-Based Access**: Admin and user roles with protected endpoints.
- **Job Management**: Create, update, delete, and view job postings (admin), and public job listings (all users).
- **Application Management**: Users can apply for jobs; admins can view all applications.
- **Email Notifications**: Automatic email notifications on application submission.
- **Validation & Error Handling**: Strong input validation and consistent error responses.
- **API Documentation**: Swagger UI available for easy API exploration.
- **Testing**: Comprehensive Jest/Supertest test suite.

## Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd core-server-job-board
```

### 2. Install Dependencies

```sh
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and update values as needed:

```sh
cp .env.example .env
```

Edit `.env` to set your secrets, email credentials, and other configuration.

### 4. Database Setup

Run migrations and seed the database:

```sh
pnpm run migrate
pnpm run seed
```

### 5. Start the Server

```sh
pnpm dev
```

The API will be available at `http://localhost:3000` by default.

### 6. API Documentation

Visit `http://localhost:3000/api/docs` for interactive Swagger documentation.

### 7. Running Tests

```sh
pnpm test
```

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

- `src/controllers/` — Route handlers for authentication, jobs, applications
- `src/routes/` — Express route definitions
- `src/middlewares/` — Auth, role, and error handling middleware
- `src/services/` — Business logic and integrations
- `src/database/` — Migrations and seeds
- `src/utils/` — Utility functions
- `tests/` — Jest/Supertest test suites


<img width="1439" height="900" alt="Screenshot 2025-08-12 at 17 12 19" src="https://github.com/user-attachments/assets/09849293-3a7d-41e6-af1c-a9e5afa4057c" />
<img width="1435" height="891" alt="Screenshot 2025-08-12 at 17 12 06" src="https://github.com/user-attachments/assets/ae14a3e2-e5b9-47f5-9db6-f4386c80f705" />
