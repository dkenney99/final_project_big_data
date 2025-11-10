const { analyzeSentiment } = require("../src/services/sentimentService");

describe("analyzeSentiment", () => {
  test("detects positive sentiment", () => {
    expect(analyzeSentiment("This was a great and excellent course")).toBe("positive");
  });

  test("detects negative sentiment", () => {
    expect(analyzeSentiment("Terrible, confusing and bad")).toBe("negative");
  });

  test("defaults to neutral", () => {
    expect(analyzeSentiment("It was fine")).toBe("neutral");
  });

  test("handles empty input", () => {
    expect(analyzeSentiment("")).toBe("neutral");
    expect(analyzeSentiment(null)).toBe("neutral");
  });
});
