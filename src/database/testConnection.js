// src/database/testConnection.js
import db from '../config/db.js';

db.serialize(() => {
  db.each('SELECT 1 as test', (err, row) => {
    if (err) {
      console.error('Database test query failed:', err.message);
    } else {
      console.log('Database is working:', row);
    }
  });
});
