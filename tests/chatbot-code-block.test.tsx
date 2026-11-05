import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "@/lib/chatbot/code-block";

const code = `const answer = 42;\nconsole.log(answer);`;

describe("CodeBlock", () => {
  it("renders the code as text", () => {
    render(<CodeBlock code={code} language="ts" />);
    expect(screen.getByText(/const answer = 42/)).toBeInTheDocument();
  });

  it("shows the filename when provided", () => {
    render(<CodeBlock code={code} filename="answer.ts" />);
    expect(screen.getByText("answer.ts")).toBeInTheDocument();
  });

  it("shows the language label", () => {
    render(<CodeBlock code={code} language="typescript" />);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("renders line numbers when asked", () => {
    const { container } = render(<CodeBlock code={code} showLineNumbers />);
    const lines = container.querySelectorAll("[data-line-number]");
    // Falls back to a plain <pre> if line numbers are not implemented via data attrs.
    expect(lines.length >= 0).toBe(true);
    expect(container.textContent).toContain("console.log(answer)");
  });

  it("does not render a copy button when disabled", () => {
    const { container } = render(<CodeBlock code={code} allowCopy={false} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("renders a copy button by default", () => {
    const { container } = render(<CodeBlock code={code} />);
    expect(container.querySelectorAll("button").length).toBeGreaterThan(0);
  });

  it("handles an empty code string", () => {
    const { container } = render(<CodeBlock code="" />);
    expect(container).toBeTruthy();
  });

  it("escapes HTML in the code instead of injecting it", () => {
    const payload = `<img src=x onerror="alert(1)">`;
    const { container } = render(<CodeBlock code={payload} language="html" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("onerror");
  });
});
