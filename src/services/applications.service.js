import openDb from '../config/db.vercel.js';

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
    const params = [jobId];
    let dateFilter = '';

    if (fromDate) {
      dateFilter += ' AND a.created_at >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      dateFilter += ' AND a.created_at <= ?';
      params.push(toDate);
    }

    const query = `
    SELECT 
      a.*, 
      u.email AS applicant, 
      u.name AS applicant_name, 
      j.title AS job_title, 
      j.company AS job_company,
      (SELECT COUNT(*) 
       FROM applications 
       WHERE jobId = a.jobId
       ${fromDate ? ' AND created_at >= ?' : ''}
       ${toDate ? ' AND created_at <= ?' : ''}
      ) AS totalApplicants
    FROM applications a
    JOIN users u ON a.userId = u.id
    JOIN jobs j ON a.jobId = j.id
    WHERE a.jobId = ? ${dateFilter}
    ORDER BY a.created_at DESC
  `;

    // Build parameters for subquery count
    const subqueryParams = [];
    if (fromDate) subqueryParams.push(fromDate);
    if (toDate) subqueryParams.push(toDate);

    return new Promise((resolve, reject) => {
      openDb.all(query, [...subqueryParams, ...params], (err, rows) => {
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
