import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton, SkeletonCard, SkeletonMetricCard, SkeletonCandidateCard, SkeletonAuthCard, SkeletonBillingCards, SkeletonProfileCard } from "../skeleton";

describe("Skeleton", () => {
  it("renders with skeleton class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton");
  });

  it("forwards className", () => {
    const { container } = render(<Skeleton className="h-10 w-20" />);
    expect(container.firstChild).toHaveClass("h-10");
  });
});

describe("SkeletonCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SkeletonMetricCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonMetricCard />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SkeletonCandidateCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonCandidateCard />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SkeletonAuthCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonAuthCard />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SkeletonBillingCards", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonBillingCards />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("SkeletonProfileCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonProfileCard />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
