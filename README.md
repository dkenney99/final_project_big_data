# Course Feedback Analyzer
Applications of Software Architecture for Big Data – Final Project

A simple web application for collecting and analyzing course feedback.  
It demonstrates the use of REST APIs, messaging queues, data persistence, and data analysis within a deployable Node.js application hosted on Render.

---

## Project Overview

Purpose:  
Students can submit feedback for a course through a web form.  
Feedback is queued for processing, analyzed for sentiment, and stored in a persistent database.  
An instructor can view reports summarizing ratings and sentiment distribution.

Key Features:
- Web-based feedback form and reporting interface  
- RESTful API endpoints  
- Asynchronous message queue for decoupling input and processing  
- Persistent data storage using SQLite  
- Basic text-based sentiment analysis  
- Unit tests for core logic  
- Deployed to a live URL for grading

---

## System Requirements and Grading Mapping

| Requirement | Description | Points |
|--------------|-------------|--------|
| System requirements specific & testable | Clearly defined endpoints, queue, analysis, and database schema | 3 |
| Good design decisions (report) | Layered architecture, separation of concerns, clear worker pattern | 1 |
| Accessible functional URL | Deployed on Render (see below) | 1 |
| Uses a messaging queue | Database-backed message queue implemented in `queueService.js` | 1 |
| Uses REST API | Endpoints under `/api` for feedback and stats | 1 |
| Uses persistent data storage | SQLite database stored in `data.sqlite` | 1 |
| Performs data analysis | Sentiment analysis and rating aggregation in worker and stats services | 1 |

Total: 9 points

---

## Architecture Overview

+---------------------------+
| Frontend |
| (HTML + JS static site) |
| - Feedback form |
| - Reports view |
+-------------+-------------+
|
v
+---------------------------+
| REST API |
| (Node.js + Express) |
| Routes: /api/feedback, |
| /api/stats |
+-------------+-------------+
|
v
+---------------------------+
| Message Queue |
| (queue_messages table) |
| - Stores pending inputs |
+-------------+-------------+
|
v
+---------------------------+
| Worker Loop |
| - Reads queue |
| - Analyzes sentiment |
| - Saves to feedbacks DB |
+-------------+-------------+
|
v
+---------------------------+
| Persistent Data Store |
| (SQLite) |
+---------------------------+


---

## Data Model

**feedbacks table**

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER | Primary key |
| createdAt | TEXT | Timestamp |
| name | TEXT | Optional user name |
| courseCode | TEXT | Course identifier |
| rating | INTEGER | 1–5 rating |
| comments | TEXT | Free text |
| sentiment | TEXT | positive / neutral / negative |

**queue_messages table**

| Column | Type | Description |
|---------|------|-------------|
| id | INTEGER | Primary key |
| createdAt | TEXT | Timestamp |
| type | TEXT | Message type (`NEW_FEEDBACK`) |
| payload | TEXT | JSON data |
| processed | INTEGER | 0 or 1 |
| processedAt | TEXT | When completed |

---

## Local Setup

Requirements:
- Node.js 20.x
- npm

Steps:

```bash
git clone https://github.com/<your-username>/course-feedback-analyzer.git
cd course-feedback-analyzer
npm install
npm start


Open your browser to http://localhost:3000.

The worker process is embedded and runs automatically inside the same process, polling the message queue every few seconds.

To run tests:
npm test
