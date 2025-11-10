const db = require("../db");

function enqueueFeedback(feedback) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO queue_messages (createdAt, type, payload, processed)
      VALUES (?, ?, ?, 0)
    `);

    const now = new Date().toISOString();
    const payload = JSON.stringify(feedback);

    stmt.run(now, "NEW_FEEDBACK", payload, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

function getPendingMessages(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM queue_messages
      WHERE processed = 0
      ORDER BY id ASC
      LIMIT ?
    `,
      [limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function markProcessed(id) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(
      `
      UPDATE queue_messages
      SET processed = 1, processedAt = ?
      WHERE id = ?
    `,
      [now, id],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  enqueueFeedback,
  getPendingMessages,
  markProcessed
};
