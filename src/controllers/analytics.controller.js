import openDb from '../config/db.js';

export const getAnalytics = async (req, res, next) => {
  try {
    // Count users
    const usersCount = await new Promise((resolve, reject) => {
      openDb.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
    // Count jobs
    const jobsCount = await new Promise((resolve, reject) => {
      openDb.get('SELECT COUNT(*) as count FROM jobs', [], (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
    // Count applications
    const applicationsCount = await new Promise((resolve, reject) => {
      openDb.get(
        'SELECT COUNT(*) as count FROM applications',
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row.count);
        }
      );
    });

    // Jobs posted in last 6 months
    const jobsLast6Months = await new Promise((resolve, reject) => {
      openDb.get(
        `SELECT COUNT(*) as count FROM jobs WHERE created_at >= date('now', '-6 months')`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row.count);
        }
      );
    });

    // Applications received in last 6 months
    const applicationsLast6Months = await new Promise((resolve, reject) => {
      openDb.get(
        `SELECT COUNT(*) as count FROM applications WHERE created_at >= date('now', '-6 months')`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row.count);
        }
      );
    });

    res.json({
      success: true,
      data: {
        users: usersCount,
        jobs: jobsCount,
        applications: applicationsCount,
        jobsPostedLast6Months: jobsLast6Months,
        applicationsReceivedLast6Months: applicationsLast6Months,
      },
    });
  } catch (err) {
    next(err);
  }
};
