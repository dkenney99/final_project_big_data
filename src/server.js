// src/server.js
const path = require("path");
const express = require("express");
const cors = require("cors");

const feedbackRoutes = require("./routes/feedbackRoutes");
require("./db"); // ensure DB is initialized

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static frontend
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// API routes
app.use("/api", feedbackRoutes);

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
