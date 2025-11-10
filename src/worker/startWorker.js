const { getPendingMessages, markProcessed } = require("../services/queueService");
const { insertFeedback } = require("../services/feedbackService");
const { analyzeSentiment } = require("../services/sentimentService");

async function processMessages() {
  try {
    const messages = await getPendingMessages(20);
    if (messages.length === 0) {
      return;
    }

    for (const msg of messages) {
      try {
        const payload = JSON.parse(msg.payload);

        const sentiment = analyzeSentiment(payload.comments || "");
        const feedbackToStore = {
          name: payload.name || null,
          courseCode: payload.courseCode,
          rating: payload.rating,
          comments: payload.comments || "",
          sentiment
        };

        await insertFeedback(feedbackToStore);
        await markProcessed(msg.id);

        console.log(`Processed message ${msg.id} for course ${payload.courseCode}`);
      } catch (err) {
        console.error("Error processing message", msg.id, err);
        // mark processed to avoid infinite retry; in a real system you'd handle this differently
        await markProcessed(msg.id);
      }
    }
  } catch (err) {
    console.error("Error in worker loop", err);
  }
}

function startWorkerLoop(intervalMs = 3000) {
  console.log("Starting embedded feedback worker loop");
  setInterval(processMessages, intervalMs);
}

module.exports = { startWorkerLoop };
