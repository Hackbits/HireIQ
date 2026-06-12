import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CandidateCard from "../CandidateCard";
import type { Candidate } from "@/lib/types";

const mockCandidate: Candidate = {
  id: "c-1",
  name: "John Doe",
  score: 85,
  matchedSkills: ["React", "TypeScript", "Node.js"],
  missingSkills: ["AWS", "Docker"],
  summary: "Experienced full-stack developer with 5+ years.",
  recommendation: "strong_fit",
  processedAt: "2024-06-01T10:00:00Z",
};

describe("CandidateCard", () => {
  it("renders candidate name and score", () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("renders recommendation badge", () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText("Strong Fit")).toBeInTheDocument();
  });

  it("renders matched and missing skills", () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("renders candidate summary", () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText(/Experienced full-stack developer/)).toBeInTheDocument();
  });

  it("shows checkbox when onToggle is provided", () => {
    const onToggle = vi.fn();
    render(<CandidateCard candidate={mockCandidate} onToggle={onToggle} />);
    const checkbox = screen.getByRole("button", { name: /select candidate/i });
    expect(checkbox).toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<CandidateCard candidate={mockCandidate} onToggle={onToggle} />);
    await user.click(screen.getByRole("button", { name: /select candidate/i }));
    expect(onToggle).toHaveBeenCalledWith("c-1");
  });

  it("does not show checkbox without onToggle", () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.queryByRole("button", { name: /select candidate/i })).not.toBeInTheDocument();
  });

  it("renders not_fit with correct label", () => {
    const notFit = { ...mockCandidate, score: 30, recommendation: "not_fit" as const };
    render(<CandidateCard candidate={notFit} />);
    expect(screen.getByText("Not a Fit")).toBeInTheDocument();
  });

  it("limits matched skills to 8", () => {
    const manySkills = {
      ...mockCandidate,
      matchedSkills: Array.from({ length: 12 }, (_, i) => `Skill ${i + 1}`),
    };
    render(<CandidateCard candidate={manySkills} />);
    expect(screen.getByText("Skill 8")).toBeInTheDocument();
    expect(screen.queryByText("Skill 9")).not.toBeInTheDocument();
  });

  it("limits missing skills to 6", () => {
    const manyMissing = {
      ...mockCandidate,
      missingSkills: Array.from({ length: 10 }, (_, i) => `Missing ${i + 1}`),
    };
    render(<CandidateCard candidate={manyMissing} />);
    expect(screen.getByText("Missing 6")).toBeInTheDocument();
    expect(screen.queryByText("Missing 7")).not.toBeInTheDocument();
  });
});
