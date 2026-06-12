import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockToast = vi.hoisted(() => vi.fn());
const mockAddDoc = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { uid: "test-uid", email: "test@test.com" },
    profile: { plan: "free", screensUsed: 0, screensLimit: 20 },
  }),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: mockAddDoc,
  serverTimestamp: () => ({ _methodName: "serverTimestamp" }),
}));

vi.mock("@/utils/uploadthing", () => ({
  uploadFiles: vi.fn().mockResolvedValue([{ url: "https://ut.dev/file.pdf" }]),
}));

vi.mock("pdfjs-dist", () => ({
  default: {
    GlobalWorkerOptions: { workerSrc: "" },
    getDocument: () => ({ promise: Promise.resolve({ numPages: 1 }) }),
    version: "5.6.205",
  },
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: () => ({ promise: Promise.resolve({ numPages: 1 }) }),
  version: "5.6.205",
}));

import UploadForm from "../UploadForm";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UploadForm", () => {
  it("renders form fields", () => {
    render(<UploadForm onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText(/senior frontend/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste the full job description/i)).toBeInTheDocument();
    expect(screen.getByText(/click or drag dropping pdfs/i)).toBeInTheDocument();
  });

  it("disables submit button when no files", () => {
    render(<UploadForm onSuccess={vi.fn()} />);
    expect(screen.getByRole("button", { name: /screen 0 candidates/i })).toBeDisabled();
  });

  it("shows file name after file selection", async () => {
    const user = userEvent.setup();
    const { container } = render(<UploadForm onSuccess={vi.fn()} />);

    const file = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
    const input = container.querySelector('input[type="file"]')!;
    await user.upload(input, file);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("renders job title and description inputs", () => {
    render(<UploadForm onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText(/senior frontend/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste the full job description/i)).toBeInTheDocument();
  });
});
