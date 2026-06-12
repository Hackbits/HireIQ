import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass("bg-primary/10");
  });

  it("applies success variant", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass("bg-success/10");
  });

  it("applies destructive variant", () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    expect(container.firstChild).toHaveClass("bg-destructive/10");
  });

  it("forwards className", () => {
    const { container } = render(<Badge className="custom">Badge</Badge>);
    expect(container.firstChild).toHaveClass("custom");
  });
});
