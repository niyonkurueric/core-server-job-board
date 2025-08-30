import openDb from '../config/db.vercel.js';

class JobsService {
  getAllJobs({
    page = 1,
    pageSize = 10,
    search = '',
    location = '',
    status = '',
  } = {}) {
    const offset = (page - 1) * pageSize;
    const params = [];
    const filters = [];

    // Base query with LEFT JOIN to count applicants
    let query = `
    SELECT 
      j.*, 
      COUNT(a.id) AS totalApplicants
    FROM jobs j
    LEFT JOIN applications a ON a.jobId = j.id
  `;

    // Filters
    if (search) {
      filters.push('(j.title ILIKE ? OR j.company ILIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (location) {
      filters.push('j.location = ?');
      params.push(location);
    }

    if (status) {
      if (status === 'published') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.push('j.status = ? AND j.deadline >= ?');
        params.push('published', today.getTime());
      } else {
        filters.push('j.status = ?');
        params.push(status);
      }
    }

    if (filters.length) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    query += ' GROUP BY j.id ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    return new Promise((resolve, reject) => {
      openDb.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  getJobById(id) {
    return new Promise((resolve, reject) => {
      openDb.get(`SELECT * FROM jobs WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  createJob({
    title,
    description,
    company,
    location,
    deadline,
    status,
    created_by,
  }) {
    return new Promise((resolve, reject) => {
      openDb.run(
        `INSERT INTO jobs (title, description, company, location, deadline, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          company || '',
          location || '',
          deadline,
          status,
          created_by,
        ],
        function (err) {
          if (err) return reject(err);
          resolve({
            id: this.lastID,
            title,
            description,
            company,
            location,
            deadline,
            created_by,
          });
        }
      );
    });
  }

  updateJob(id, { title, description, company, location, deadline, status }) {
    return new Promise((resolve, reject) => {
      openDb.run(
        `UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, deadline = ?, status = ? WHERE id = ?`,
        [
          title,
          description,
          company || '',
          location || '',
          deadline,
          status,
          id,
        ],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  deleteJob(id) {
    return new Promise((resolve, reject) => {
      openDb.run(`DELETE FROM jobs WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
}

export default new JobsService();
