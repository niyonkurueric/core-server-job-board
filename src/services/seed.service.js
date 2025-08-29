import db from '../config/db.vercel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    const isVercel =
      process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

    if (!isVercel) {
      resolve(); // Don't seed on local development
      return;
    }

    // Check if admin user already exists
    db.get(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'",
      (err, row) => {
        if (err) {
          // Table doesn't exist or error, proceed with seeding
          seedAdminUser()
            .then(() => seedSampleJobs())
            .then(() => {
              console.log('Database seeded successfully on Vercel');
              resolve();
            })
            .catch(reject);
        } else if (row.count === 0) {
          // Admin doesn't exist, seed the database
          seedAdminUser()
            .then(() => seedSampleJobs())
            .then(() => {
              console.log('Database seeded successfully on Vercel');
              resolve();
            })
            .catch(reject);
        } else {
          // Admin exists, just seed jobs if needed
          seedSampleJobs()
            .then(() => {
              console.log('Database already seeded, skipping admin creation');
              resolve();
            })
            .catch(reject);
        }
      }
    );
  });
};

const seedAdminUser = () => {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync('admin123', 10);

    const adminUser = {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      name: 'Admin User',
      created_at: new Date().toISOString(),
    };

    db.run(
      `
      INSERT INTO users (email, password, role, name, created_at) 
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        adminUser.email,
        adminUser.password,
        adminUser.role,
        adminUser.name,
        adminUser.created_at,
      ],
      (err) => {
        if (err) {
          console.error('Failed to seed admin user:', err);
          reject(err);
        } else {
          console.log('Admin user seeded successfully');
          resolve();
        }
      }
    );
  });
};

const seedSampleJobs = () => {
  return new Promise((resolve, reject) => {
    // Check if jobs already exist
    db.get('SELECT COUNT(*) as count FROM jobs', (err, row) => {
      if (err || row.count === 0) {
        const sampleJobs = [
          {
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Remote',
            description: 'Full-stack development role',
            requirements: 'JavaScript, Node.js, React',
            salary: '80000-120000',
            type: 'Full-time',
            status: 'active',
          },
          {
            title: 'Data Analyst',
            company: 'Data Inc',
            location: 'New York',
            description: 'Data analysis and visualization',
            requirements: 'Python, SQL, Tableau',
            salary: '60000-90000',
            type: 'Full-time',
            status: 'active',
          },
        ];

        let completed = 0;
        const total = sampleJobs.length;

        sampleJobs.forEach((job) => {
          db.run(
            `
            INSERT INTO jobs (title, company, location, description, requirements, salary, type, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              job.title,
              job.company,
              job.location,
              job.description,
              job.requirements,
              job.salary,
              job.type,
              job.status,
              new Date().toISOString(),
            ],
            (err) => {
              if (err) {
                console.error('Failed to seed job:', err);
                reject(err);
                return;
              }

              completed++;
              if (completed === total) {
                console.log('Sample jobs seeded successfully');
                resolve();
              }
            }
          );
        });
      } else {
        console.log('Jobs already exist, skipping job seeding');
        resolve();
      }
    });
  });
};
