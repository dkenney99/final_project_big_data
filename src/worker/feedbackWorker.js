const { getPendingMessages, markProcessed } = require("../services/queueService");
const { insertFeedback } = require("../services/feedbackService");
const { analyzeSentiment } = require("../services/sentimentService");

console.log("Feedback worker started");

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
        // In a real system, you might mark as dead-letter or similar
        await markProcessed(msg.id);
      }
    }
  } catch (err) {
    console.error("Error in worker loop", err);
  }
}

// Poll every 3 seconds
setInterval(processMessages, 3000);
