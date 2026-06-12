import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../screen/route";

const mockScreenResume = vi.hoisted(() => vi.fn());
const mockCheckRateLimit = vi.hoisted(() => vi.fn());
const mockCollection = vi.hoisted(() => vi.fn());
const mockDoc = vi.hoisted(() => vi.fn());
const mockGet = vi.hoisted(() => vi.fn());
const mockAdd = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());

vi.mock("@/lib/gemini", () => ({
  screenResume: mockScreenResume,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mockCheckRateLimit,
}));

vi.mock("@/lib/firebase-admin", () => ({
  adminDb: () => ({
    collection: mockCollection,
  }),
}));

vi.mock("firebase-admin", () => ({
  default: {
    firestore: {
      FieldValue: {
        serverTimestamp: () => ({ _methodName: "serverTimestamp" }),
        increment: (n: number) => ({ _methodName: "increment", n }),
      },
    },
  },
  firestore: {
    FieldValue: {
      serverTimestamp: () => ({ _methodName: "serverTimestamp" }),
      increment: (n: number) => ({ _methodName: "increment", n }),
    },
  },
}));

function mockRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/screen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockReturnValue({ allowed: true, remaining: 9, resetAt: Date.now() + 60000 });
});

describe("POST /api/screen", () => {
  it("returns 400 for missing fields", async () => {
    const res = await POST(mockRequest({ resumeText: "text" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing required fields");
  });

  it("returns 429 when rate limited", async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60000 });
    const res = await POST(mockRequest({
      resumeText: "text", jobDescription: "desc", jobId: "1", firebaseUid: "u1",
    }));
    expect(res.status).toBe(429);
  });

  it("returns 404 for unknown user", async () => {
    mockDoc.mockReturnValue({ get: mockGet });
    mockCollection.mockReturnValue({ doc: mockDoc });
    mockGet.mockResolvedValue({ exists: false });

    const res = await POST(mockRequest({
      resumeText: "text", jobDescription: "desc", jobId: "1", firebaseUid: "u1",
    }));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("User not found");
  });

  it("returns 403 when free quota exceeded", async () => {
    mockDoc.mockReturnValue({ get: mockGet, update: mockUpdate });
    mockCollection.mockReturnValue({ doc: mockDoc, add: mockAdd });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ plan: "free", screensUsed: 20 }),
    });

    const res = await POST(mockRequest({
      resumeText: "text", jobDescription: "desc", jobId: "1", firebaseUid: "u1",
    }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Quota exceeded");
  });

  it("returns 200 on successful screening", async () => {
    mockDoc.mockReturnValue({ get: mockGet, update: mockUpdate });
    mockCollection.mockReturnValue({ doc: mockDoc, add: mockAdd });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ plan: "free", screensUsed: 5 }),
    });
    mockScreenResume.mockResolvedValue({
      score: 85,
      matchedSkills: ["React"],
      missingSkills: ["AWS"],
      summary: "Great candidate",
      recommendation: "strong_fit",
    });
    mockAdd.mockResolvedValue({ id: "candidate-1" });

    const res = await POST(mockRequest({
      resumeText: "resume", jobDescription: "desc", jobId: "job-1",
      firebaseUid: "u1", candidateName: "John Doe",
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.result.score).toBe(85);
  });

  it("allows pro users with high quota", async () => {
    mockDoc.mockReturnValue({ get: mockGet, update: mockUpdate });
    mockCollection.mockReturnValue({ doc: mockDoc, add: mockAdd });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ plan: "pro", screensUsed: 5000, screensLimit: 999999 }),
    });
    mockScreenResume.mockResolvedValue({
      score: 70, matchedSkills: [], missingSkills: [],
      summary: "Ok", recommendation: "possible_fit",
    });
    mockAdd.mockResolvedValue({ id: "c-1" });

    const res = await POST(mockRequest({
      resumeText: "t", jobDescription: "d", jobId: "j", firebaseUid: "u",
    }));
    expect(res.status).toBe(200);
  });

  it("returns 500 on internal error", async () => {
    mockDoc.mockReturnValue({ get: mockGet });
    mockCollection.mockReturnValue({ doc: mockDoc });
    mockGet.mockRejectedValue(new Error("DB connection failed"));

    const res = await POST(mockRequest({
      resumeText: "t", jobDescription: "d", jobId: "j", firebaseUid: "u",
    }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("DB connection failed");
  });
});
