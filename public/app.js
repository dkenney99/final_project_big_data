async function submitFeedback(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const courseCode = document.getElementById("courseCode").value.trim();
  const rating = document.getElementById("rating").value;
  const comments = document.getElementById("comments").value;

  const statusEl = document.getElementById("submitStatus");
  statusEl.textContent = "";

  if (!courseCode) {
    statusEl.textContent = "Course code is required.";
    return;
  }

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, courseCode, rating, comments })
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = "Error: " + (data.errors ? data.errors.join(", ") : data.error || "Unknown error");
      return;
    }

    statusEl.textContent = "Feedback submitted and queued for processing.";
    document.getElementById("feedbackForm").reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Network error submitting feedback.";
  }
}

async function loadReport() {
  const courseCode = document.getElementById("reportCourseCode").value.trim();
  const statsArea = document.getElementById("statsArea");
  const tableContainer = document.getElementById("feedbackTableContainer");

  statsArea.textContent = "";
  tableContainer.innerHTML = "";

  if (!courseCode) {
    statsArea.textContent = "Enter a course code to view stats.";
    return;
  }

  try {
    const [statsRes, feedbackRes] = await Promise.all([
      fetch(`/api/stats?courseCode=${encodeURIComponent(courseCode)}`),
      fetch(`/api/feedback?courseCode=${encodeURIComponent(courseCode)}`)
    ]);

    const statsData = await statsRes.json();
    const feedbackData = await feedbackRes.json();

    if (!statsRes.ok) {
      statsArea.textContent = "Error loading stats: " + (statsData.error || "Unknown error");
      return;
    }

    statsArea.innerHTML = `
      <p><strong>Course:</strong> ${statsData.courseCode}</p>
      <p><strong>Responses:</strong> ${statsData.responseCount}</p>
      <p><strong>Average rating:</strong> ${statsData.averageRating ?? "N/A"}</p>
      <p><strong>Sentiment:</strong>
        Positive: ${statsData.sentiment.positive},
        Neutral: ${statsData.sentiment.neutral},
        Negative: ${statsData.sentiment.negative}
      </p>
    `;

    if (feedbackData.items && feedbackData.items.length > 0) {
      const rows = feedbackData.items
        .map(
          f => `
          <tr>
            <td>${f.createdAt}</td>
            <td>${f.name || ""}</td>
            <td>${f.rating}</td>
            <td>${f.sentiment}</td>
            <td>${(f.comments || "").replace(/</g, "&lt;")}</td>
          </tr>
        `
        )
        .join("");

      tableContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Created</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Sentiment</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    } else {
      tableContainer.innerHTML = "<p>No feedback found for this course yet.</p>";
    }
  } catch (err) {
    console.error(err);
    statsArea.textContent = "Network error loading report.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("feedbackForm").addEventListener("submit", submitFeedback);
  document.getElementById("loadReportBtn").addEventListener("click", loadReport);
});
