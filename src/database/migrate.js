import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import database from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MigrationManager {
  constructor() {
    this.migrationsPath = join(__dirname, 'migrations');
    this.migrations = [];
  }

  // Load all migration files
  async loadMigrations() {
    try {
      const files = fs
        .readdirSync(this.migrationsPath)
        .filter((file) => file.endsWith('.sql'))
        .sort(); // Sort to ensure order

      for (const file of files) {
        const filePath = join(this.migrationsPath, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        this.migrations.push({
          name: file,
          path: filePath,
          sql: sql,
        });
      }

      console.log(`📁 Loaded ${this.migrations.length} migration files`);
      return this.migrations;
    } catch (error) {
      console.error('❌ Error loading migrations:', error.message);
      throw error;
    }
  }

  // Create migrations table if it doesn't exist
  async createMigrationsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await database.run(sql);
      console.log('✅ Migrations table created/verified');
    } catch (error) {
      console.error('❌ Error creating migrations table:', error.message);
      throw error;
    }
  }

  // Get executed migrations
  async getExecutedMigrations() {
    try {
      const rows = await database.all(
        'SELECT name FROM migrations ORDER BY id'
      );
      return rows.map((row) => row.name);
    } catch (error) {
      console.error('❌ Error getting executed migrations:', error.message);
      return [];
    }
  }

  // Execute a single migration
  async executeMigration(migration) {
    try {
      console.log(`🔄 Executing migration: ${migration.name}`);

      // Split SQL into individual statements
      const statements = migration.sql
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await database.exec(statement);
        }
      }

      // Record migration as executed
      await database.run('INSERT INTO migrations (name) VALUES (?)', [
        migration.name,
      ]);

      console.log(`✅ Migration ${migration.name} executed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Migration ${migration.name} failed:`, error.message);
      throw error;
    }
  }

  // Run all pending migrations
  async runMigrations() {
    try {
      console.log('🚀 Starting database migrations...');

      // Initialize database
      await database.initialize();

      // Create migrations table
      await this.createMigrationsTable();

      // Load migration files
      await this.loadMigrations();

      // Get executed migrations
      const executedMigrations = await this.getExecutedMigrations();

      // Find pending migrations
      const pendingMigrations = this.migrations.filter(
        (migration) => !executedMigrations.includes(migration.name)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations');
        return;
      }

      console.log(`📋 Found ${pendingMigrations.length} pending migrations`);

      // Execute pending migrations
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }

      console.log('🎉 All migrations completed successfully!');
    } catch (error) {
      console.error('❌ Migration process failed:', error.message);
      throw error;
    } finally {
      await database.close();
    }
  }

  // Show migration status
  async showStatus() {
    try {
      await database.initialize();
      await this.createMigrationsTable();
      await this.loadMigrations();

      const executedMigrations = await this.getExecutedMigrations();

      console.log('\n📊 Migration Status:');
      console.log('==================');

      for (const migration of this.migrations) {
        const status = executedMigrations.includes(migration.name)
          ? '✅'
          : '⏳';
        console.log(`${status} ${migration.name}`);
      }

      const pendingCount = this.migrations.length - executedMigrations.length;
      console.log(
        `\n📈 Summary: ${executedMigrations.length} executed, ${pendingCount} pending`
      );
    } catch (error) {
      console.error('❌ Error showing migration status:', error.message);
    } finally {
      await database.close();
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const migrationManager = new MigrationManager();

  try {
    switch (command) {
      case 'run':
        await migrationManager.runMigrations();
        break;
      case 'status':
        await migrationManager.showStatus();
        break;
      default:
        console.log('Usage: node migrate.js [run|status]');
        console.log('  run    - Execute pending migrations');
        console.log('  status - Show migration status');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default MigrationManager;
