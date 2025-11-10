const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Feedback table
  db.run(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      name TEXT,
      courseCode TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comments TEXT,
      sentiment TEXT NOT NULL
    )
  `);

  // Simple queue table
  db.run(`
    CREATE TABLE IF NOT EXISTS queue_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER NOT NULL DEFAULT 0,
      processedAt TEXT
    )
  `);
});

module.exports = db;
