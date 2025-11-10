// src/routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();

const { enqueueFeedback } = require("../services/queueService");
const { getFeedbacks } = require("../services/feedbackService");
const { getStats } = require("../services/statsService");

// Validation helper
function validateFeedback(body) {
  const errors = [];

  if (!body.courseCode || typeof body.courseCode !== "string" || body.courseCode.trim() === "") {
    errors.push("courseCode is required");
  }

  const rating = Number(body.rating);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.push("rating must be an integer between 1 and 5");
  }

  return { errors, rating };
}

// POST /api/feedback - enqueue feedback
router.post("/feedback", async (req, res) => {
  try {
    const { errors, rating } = validateFeedback(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const feedback = {
      name: req.body.name || null,
      courseCode: req.body.courseCode.trim(),
      rating,
      comments: req.body.comments || ""
    };

    await enqueueFeedback(feedback);

    return res.status(201).json({ status: "queued" });
  } catch (err) {
    console.error("Error in POST /api/feedback", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/feedback?courseCode=CS550
router.get("/feedback", async (req, res) => {
  try {
    const courseCode = req.query.courseCode;
    const feedbacks = await getFeedbacks(courseCode);
    return res.json({ items: feedbacks });
  } catch (err) {
    console.error("Error in GET /api/feedback", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stats?courseCode=CS550
router.get("/stats", async (req, res) => {
  try {
    const courseCode = req.query.courseCode;
    if (!courseCode) {
      return res.status(400).json({ error: "courseCode query parameter is required" });
    }

    const stats = await getStats(courseCode);
    return res.json(stats);
  } catch (err) {
    console.error("Error in GET /api/stats", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
