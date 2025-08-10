import openDb from '../config/db.js';

class ApplicationsService {
  applyToJob({ userId, jobId, cover_letter, cv_url }) {
    return new Promise((resolve, reject) => {
      openDb.run(
        `INSERT INTO applications (userId, jobId, cover_letter, cv_url) VALUES (?, ?, ?, ?)`,
        [userId, jobId, cover_letter || '', cv_url || ''],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, userId, jobId, cover_letter, cv_url });
        }
      );
    });
  }

  getApplicationsByJob(jobId) {
    return new Promise((resolve, reject) => {
      openDb.all(
        `SELECT a.*, u.email as applicant FROM applications a JOIN users u ON a.userId = u.id WHERE a.jobId = ? ORDER BY a.created_at DESC`,
        [jobId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  getApplicationsByUser(userId) {
    return new Promise((resolve, reject) => {
      openDb.all(
        `SELECT a.*, j.title as job_title FROM applications a JOIN jobs j ON a.jobId = j.id WHERE a.userId = ? ORDER BY a.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

export default new ApplicationsService();
