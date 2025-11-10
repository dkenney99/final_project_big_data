const db = require("../db");

function getFeedbacks(courseCode) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM feedbacks";
    const params = [];

    if (courseCode) {
      query += " WHERE courseCode = ?";
      params.push(courseCode);
    }

    query += " ORDER BY createdAt DESC";

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function insertFeedback(feedback) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO feedbacks (createdAt, name, courseCode, rating, comments, sentiment)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    stmt.run(
      now,
      feedback.name || null,
      feedback.courseCode,
      feedback.rating,
      feedback.comments || null,
      feedback.sentiment,
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

module.exports = { getFeedbacks, insertFeedback };
