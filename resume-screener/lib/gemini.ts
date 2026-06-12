// lib/gemini.ts - Google Gemini AI helper
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return _genAI;
}

export interface ScreeningResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  recommendation: "strong_fit" | "possible_fit" | "not_fit";
}

const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.2,
};

export async function screenResume(
  jobDescription: string,
  resumeText: string
): Promise<ScreeningResult> {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
  });

  const prompt = `You are an expert technical recruiter. Score this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY valid JSON in exactly this format:
{
  "score": <integer 0-100>,
  "matchedSkills": <array of strings>,
  "missingSkills": <array of strings>,
  "summary": "<2 sentence candidate summary>",
  "recommendation": "<strong_fit | possible_fit | not_fit>"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = JSON.parse(text) as ScreeningResult;

  // Validate required fields
  if (
    typeof parsed.score !== "number" ||
    !Array.isArray(parsed.matchedSkills) ||
    !Array.isArray(parsed.missingSkills) ||
    typeof parsed.summary !== "string" ||
    !["strong_fit", "possible_fit", "not_fit"].includes(parsed.recommendation)
  ) {
    throw new Error("Invalid AI response structure");
  }

  return parsed;
}
