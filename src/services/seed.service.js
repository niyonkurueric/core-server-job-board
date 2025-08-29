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

    // Always try to seed, ignore errors for existing data
    Promise.all([
      seedAdminUser().catch((err) => {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log('Admin user already exists, skipping...');
        } else {
          console.error('Error seeding admin user:', err.message);
        }
      }),
      seedSampleJobs().catch((err) => {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log('Sample jobs already exist, skipping...');
        } else {
          console.error('Error seeding sample jobs:', err.message);
        }
      }),
    ])
      .then(() => {
        console.log('Database seeding completed on Vercel');
        resolve();
      })
      .catch((err) => {
        console.error('Database seeding failed:', err.message);
        // Don't reject, just resolve to continue
        resolve();
      });
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
          if (err.message.includes('UNIQUE constraint failed')) {
            console.log('Admin user already exists, skipping...');
            resolve();
          } else {
            console.error('Failed to seed admin user:', err);
            reject(err);
          }
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
            description: 'Full-stack development role with JavaScript, Node.js, and React. Join our team to build amazing web applications.',
            deadline: '2024-12-31',
            status: 'active',
          },
          {
            title: 'Data Analyst',
            company: 'Data Inc',
            location: 'New York',
            description: 'Data analysis and visualization role. Work with Python, SQL, and Tableau to extract insights from data.',
            deadline: '2024-12-31',
            status: 'active',
          },
        ];

        let completed = 0;
        const total = sampleJobs.length;

        sampleJobs.forEach((job) => {
          db.run(
            `
              INSERT INTO jobs (title, company, location, description, deadline, status, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
              job.title,
              job.company,
              job.location,
              job.description,
              job.deadline,
              job.status,
              new Date().toISOString(),
            ],
            (err) => {
              if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                  console.log('Job already exists, skipping...');
                } else {
                  console.error('Failed to seed job:', err);
                  reject(err);
                  return;
                }
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
