import bcrypt from 'bcryptjs';
import database from './database.js';

class Seeder {
  constructor() {
    this.seeds = [];
  }

  // Add seed data
  addSeed(name, data) {
    this.seeds.push({ name, data });
  }

  // Seed admin user
  async seedAdminUser() {
    try {
      console.log('👤 Seeding admin user...');

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const adminName = process.env.ADMIN_NAME || 'Admin User';

      // Check if admin already exists
      const existingAdmin = await database.get(
        'SELECT id FROM users WHERE email = ? AND role = ?',
        [adminEmail, 'admin']
      );

      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Insert admin user
      const result = await database.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin']
      );

      console.log(`✅ Admin user created with ID: ${result.lastID}`);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } catch (error) {
      console.error('❌ Error seeding admin user:', error.message);
      throw error;
    }
  }

  // Seed sample jobs
  async seedSampleJobs() {
    try {
      console.log('💼 Seeding sample jobs...');

      // Check if jobs already exist
      const existingJobs = await database.get(
        'SELECT COUNT(*) as count FROM jobs'
      );

      if (existingJobs.count > 0) {
        console.log('✅ Sample jobs already exist');
        return;
      }

      const sampleJobs = [
        {
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          description:
            'Full-stack development role with JavaScript, Node.js, and React. Join our team to build amazing web applications.',
          deadline: '2024-12-31',
          status: 'active',
        },
        {
          title: 'Data Analyst',
          company: 'Data Inc',
          location: 'New York',
          description:
            'Data analysis and visualization role. Work with Python, SQL, and Tableau to extract insights from data.',
          deadline: '2024-12-31',
          status: 'active',
        },
        {
          title: 'Product Manager',
          company: 'Innovation Labs',
          location: 'San Francisco',
          description:
            'Lead product strategy and development. Work with cross-functional teams to deliver exceptional user experiences.',
          deadline: '2024-12-31',
          status: 'active',
        },
      ];

      for (const job of sampleJobs) {
        await database.run(
          `INSERT INTO jobs (title, company, location, description, deadline, status) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            job.title,
            job.company,
            job.location,
            job.description,
            job.deadline,
            job.status,
          ]
        );
      }

      console.log(`✅ ${sampleJobs.length} sample jobs created`);
    } catch (error) {
      console.error('❌ Error seeding sample jobs:', error.message);
      throw error;
    }
  }

  // Seed sample users
  async seedSampleUsers() {
    try {
      console.log('👥 Seeding sample users...');

      // Check if sample users already exist
      const existingUsers = await database.get(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['user']
      );

      if (existingUsers.count > 2) {
        console.log('✅ Sample users already exist');
        return;
      }

      const sampleUsers = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          role: 'user',
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          password: 'password123',
          role: 'user',
        },
      ];

      for (const user of sampleUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await database.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, user.role]
        );
      }

      console.log(`✅ ${sampleUsers.length} sample users created`);
    } catch (error) {
      console.error('❌ Error seeding sample users:', error.message);
      throw error;
    }
  }

  // Run all seeds
  async runSeeds() {
    try {
      console.log('🌱 Starting database seeding...');

      // Initialize database
      await database.initialize();

      // Run seeds in order
      await this.seedAdminUser();
      await this.seedSampleJobs();
      await this.seedSampleUsers();

      console.log('🎉 All seeds completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      throw error;
    } finally {
      await database.close();
    }
  }

  // Reset database (drop all tables and recreate)
  async resetDatabase() {
    try {
      console.log('🔄 Resetting database...');

      await database.initialize();

      // Drop all tables
      const dropTables = [
        'DROP TABLE IF EXISTS applications',
        'DROP TABLE IF EXISTS jobs',
        'DROP TABLE IF EXISTS users',
        'DROP TABLE IF EXISTS migrations',
      ];

      for (const sql of dropTables) {
        await database.exec(sql);
      }

      console.log('✅ All tables dropped');

      // Run migrations to recreate tables
      console.log('🔄 Recreating tables...');
      const { MigrationManager } = await import('./migrate.js');
      const migrationManager = new MigrationManager();
      await migrationManager.runMigrations();

      // Run seeds
      await this.runSeeds();

      console.log('🎉 Database reset completed!');
    } catch (error) {
      console.error('❌ Database reset failed:', error.message);
      throw error;
    } finally {
      await database.close();
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const seeder = new Seeder();

  try {
    switch (command) {
      case 'run':
        await seeder.runSeeds();
        break;
      case 'reset':
        await seeder.resetDatabase();
        break;
      default:
        console.log('Usage: node seed.js [run|reset]');
        console.log('  run   - Run all seeds');
        console.log('  reset - Drop all tables, recreate, and seed');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default Seeder;
