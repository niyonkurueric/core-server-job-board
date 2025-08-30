import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.vercel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Database initialization for Vercel
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Check if we're on Vercel
    const isVercel =
      process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

    if (isVercel) {
      // For Vercel, create tables in memory
      const migrationFile = path.resolve(
        'src/database/migrations/004_recreate_all_tables.sql'
      );

      try {
        const sql = fs.readFileSync(migrationFile, 'utf8');

        // Split SQL into individual statements
        const statements = sql.split(';').filter((stmt) => stmt.trim());

        let completed = 0;
        const total = statements.length;

        statements.forEach((statement, index) => {
          if (statement.trim()) {
            db.run(statement, (err) => {
              if (err) {
                // Ignore errors for tables that already exist
                if (
                  err.message.includes('already exists') ||
                  err.message.includes('no such table')
                ) {
                  console.log(
                    `Migration statement ${index + 1} skipped: ${err.message}`
                  );
                } else {
                  console.error(
                    `Migration statement ${index + 1} failed:`,
                    err.message
                  );
                  reject(err);
                  return;
                }
              }

              completed++;
              if (completed === total) {
                console.log('Database initialized successfully on Vercel');
                resolve();
              }
            });
          } else {
            completed++;
            if (completed === total) {
              console.log('Database initialized successfully on Vercel');
              resolve();
            }
          }
        });
      } catch (error) {
        console.error('Failed to read migration file:', error);
        reject(error);
      }
    } else {
      // For local development, just resolve
      resolve();
    }
  });
};

export default db;
