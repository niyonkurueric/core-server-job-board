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

  getApplicationsByJob(jobId, { fromDate, toDate } = {}) {
    let query = `SELECT a.*, u.email as applicant, u.name as applicant_name, j.title as job_title, j.company as job_company
      FROM applications a
      JOIN users u ON a.userId = u.id
      JOIN jobs j ON a.jobId = j.id
      WHERE a.jobId = ?`;
    const params = [jobId];
    if (fromDate) {
      query += ' AND a.created_at >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      query += ' AND a.created_at <= ?';
      params.push(toDate);
    }
    query += ' ORDER BY a.created_at DESC';
    return new Promise((resolve, reject) => {
      openDb.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
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
