import { initializeDatabase } from './src/config/db.init.js';
import { seedDatabase } from './src/services/seed.service.js';

console.log('🧪 Testing Vercel-compatible database setup...');

// Test database initialization
async function testDatabase() {
  try {
    console.log('📊 Initializing database...');
    await initializeDatabase();

    console.log('🌱 Seeding database...');
    await seedDatabase();

    console.log('✅ Database test completed successfully!');
    console.log('🚀 Your project is ready for Vercel deployment!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
