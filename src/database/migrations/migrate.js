import fs from 'fs';
import path from 'path';
import db from '../../config/db.js';

const migrationFile = path.resolve(
  'src/database/migrations/004_recreate_all_tables.sql'
);
const sql = fs.readFileSync(migrationFile, 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Migration failed:', err.message);
  } else {
    console.log('Migration ran successfully');
  }
  db.close();
});
