import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// For Vercel, use in-memory database
const isVercel =
  process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let dbPath;
if (isVercel) {
  // Use in-memory database for Vercel
  dbPath = ':memory:';
} else {
  // Use file-based database for local development
  dbPath = join(__dirname, './job-boards-portal.db');
}

const openDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    if (isVercel) {
      console.log('Connected to in-memory SQLite database (Vercel mode).');
    } else {
      console.log('Connected to SQLite database file.');
    }
  }
});

export default openDb;
