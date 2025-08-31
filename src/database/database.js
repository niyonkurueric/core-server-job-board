import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Database {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  // Initialize database connection
  async initialize() {
    if (this.isInitialized) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const dbPath = join(__dirname, '../config/job-boards-portal.db');

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Could not connect to SQLite database:', err.message);
          reject(err);
        } else {
          console.log(' Connected to SQLite database');
          this.isInitialized = true;
          resolve(this.db);
        }
      });
    });
  }

  // Get database instance
  getInstance() {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  // Close database connection
  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed');
          }
          this.isInitialized = false;
          this.db = null;
          resolve();
        });
      });
    }
  }

  // Run a query
  async run(sql, params = []) {
    const db = this.getInstance();
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Get a single row
  async get(sql, params = []) {
    const db = this.getInstance();
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get multiple rows
  async all(sql, params = []) {
    const db = this.getInstance();
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Execute multiple statements
  async exec(sql) {
    const db = this.getInstance();
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create singleton instance
const database = new Database();

export default database;
