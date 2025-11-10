const request = require("supertest");
const path = require("path");
const express = require("express");

// Use a separate DB file for tests
process.env.DB_PATH = path.join(__dirname, "test.sqlite");

const feedbackRoutes = require("../src/routes/feedbackRoutes");
require("../src/db");

const app = express();
app.use(express.json());
app.use("/api", feedbackRoutes);

describe("POST /api/feedback validation", () => {
  test("rejects missing courseCode", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({ rating: 5, comments: "Great" });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain("courseCode is required");
  });

  test("rejects invalid rating", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({ courseCode: "CS550", rating: 6, comments: "Too high" });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0]).toMatch(/rating must be an integer between 1 and 5/);
  });

  test("accepts valid feedback", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({ courseCode: "CS550", rating: 5, comments: "Excellent course" });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("queued");
  });
});
