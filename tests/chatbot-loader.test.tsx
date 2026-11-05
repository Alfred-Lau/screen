import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loader } from "@/lib/chatbot/loader";

describe("Loader", () => {
  it("renders all four variants without crashing", () => {
    for (const variant of ["dots", "typing", "spinner", "pulse"] as const) {
      const { unmount } = render(<Loader variant={variant} />);
      expect(document.querySelector("[class]")).not.toBeNull();
      unmount();
    }
  });

  it("renders accompanying text when provided", () => {
    render(<Loader text="Thinking" />);
    expect(screen.getByText("Thinking")).toBeInTheDocument();
  });

  it("omits text when not provided", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector("span")).toBeNull();
  });

  it("accepts size variants", () => {
    const { container } = render(<Loader size="lg" variant="dots" />);
    expect(container.querySelector(".h-3")).not.toBeNull();
  });

  it("merges a custom className", () => {
    const { container } = render(<Loader className="custom-loader" />);
    expect(container.firstChild).toHaveClass("custom-loader");
  });
});
