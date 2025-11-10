const db = require("../db");

function getStats(courseCode) {
  return new Promise((resolve, reject) => {
    if (!courseCode) {
      return reject(new Error("courseCode is required"));
    }

    const baseWhere = "FROM feedbacks WHERE courseCode = ?";
    const params = [courseCode];

    const stats = {};

    db.get(
      `SELECT COUNT(*) as responseCount, AVG(rating) as averageRating ${baseWhere}`,
      params,
      (err, row) => {
        if (err) return reject(err);

        stats.courseCode = courseCode;
        stats.responseCount = row.responseCount;
        stats.averageRating = row.averageRating ? Number(row.averageRating.toFixed(2)) : null;

        db.get(
          `
          SELECT
            SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
            SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral,
            SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative
          ${baseWhere}
        `,
          params,
          (err2, row2) => {
            if (err2) return reject(err2);

            stats.sentiment = {
              positive: row2.positive || 0,
              neutral: row2.neutral || 0,
              negative: row2.negative || 0
            };

            resolve(stats);
          }
        );
      }
    );
  });
}

module.exports = { getStats };
