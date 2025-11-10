const positiveWords = ["good", "great", "excellent", "love", "helpful", "awesome", "amazing"];
const negativeWords = ["bad", "boring", "confusing", "hate", "terrible", "awful", "poor"];

function analyzeSentiment(text) {
  if (!text || typeof text !== "string") return "neutral";

  const lower = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => {
    if (lower.includes(word)) score += 1;
  });

  negativeWords.forEach(word => {
    if (lower.includes(word)) score -= 1;
  });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

module.exports = { analyzeSentiment };
