import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGenerateContent = vi.hoisted(() => vi.fn());

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn(function () {
    return {
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    };
  }),
}));

import { screenResume } from "../gemini";

beforeEach(() => {
  vi.clearAllMocks();
});

const validResponse = {
  score: 85,
  matchedSkills: ["React", "TypeScript", "Node.js"],
  missingSkills: ["AWS", "Docker"],
  summary: "Strong full-stack developer with relevant experience.",
  recommendation: "strong_fit",
};

describe("screenResume", () => {
  it("returns parsed ScreeningResult on valid AI response", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(validResponse) },
    });

    const result = await screenResume("Job description", "Resume text");
    expect(result).toEqual(validResponse);
  });

  it("throws on invalid score type", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ ...validResponse, score: "85" }) },
    });
    await expect(screenResume("JD", "Resume")).rejects.toThrow("Invalid AI response structure");
  });

  it("throws on missing matchedSkills", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ ...validResponse, matchedSkills: "React" }) },
    });
    await expect(screenResume("JD", "Resume")).rejects.toThrow("Invalid AI response structure");
  });

  it("throws on invalid recommendation value", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify({ ...validResponse, recommendation: "maybe" }) },
    });
    await expect(screenResume("JD", "Resume")).rejects.toThrow("Invalid AI response structure");
  });

  it("throws on malformed JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "not json" },
    });
    await expect(screenResume("JD", "Resume")).rejects.toThrow();
  });

  it("throws when AI API call fails", async () => {
    mockGenerateContent.mockRejectedValue(new Error("API error"));
    await expect(screenResume("JD", "Resume")).rejects.toThrow("API error");
  });
});
