import openDb from '../config/db.js';

class JobsService {
  getAllJobs({ page = 1, pageSize = 10, search = '', location = '' } = {}) {
    const offset = (page - 1) * pageSize;
    let query = `SELECT * FROM jobs`;
    const params = [];
    const filters = [];
    if (search) {
      filters.push('title LIKE ?');
      params.push(`%${search}%`);
    }
    if (location) {
      filters.push('location = ?');
      params.push(location);
    }
    if (filters.length) {
      query += ' WHERE ' + filters.join(' AND ');
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
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

  createJob({ title, description, company, location, created_by }) {
    return new Promise((resolve, reject) => {
      openDb.run(
        `INSERT INTO jobs (title, description, company, location, created_by) VALUES (?, ?, ?, ?, ?)`,
        [title, description, company || '', location || '', created_by],
        function (err) {
          if (err) return reject(err);
          resolve({
            id: this.lastID,
            title,
            description,
            company,
            location,
            created_by,
          });
        }
      );
    });
  }

  updateJob(id, { title, description, company, location }) {
    return new Promise((resolve, reject) => {
      openDb.run(
        `UPDATE jobs SET title = ?, description = ?, company = ?, location = ? WHERE id = ?`,
        [title, description, company || '', location || '', id],
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
