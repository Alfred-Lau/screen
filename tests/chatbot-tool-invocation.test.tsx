import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ToolInvocation,
  ToolInvocationHeader,
  ToolInvocationContent,
  ToolInvocationInput,
  ToolInvocationOutput,
} from "@/lib/chatbot/tool-invocation";

function renderTool(state: "input-streaming" | "input-available" | "output-available" | "output-error") {
  return render(
    <ToolInvocation state={state} defaultOpen>
      <ToolInvocationHeader name="search_web" />
      <ToolInvocationContent>
        <ToolInvocationInput input={{ q: "hello" }} />
        <ToolInvocationOutput output="3 results" />
      </ToolInvocationContent>
    </ToolInvocation>,
  );
}

describe("ToolInvocation", () => {
  it("renders the tool name", () => {
    renderTool("input-available");
    expect(screen.getByText("search_web")).toBeInTheDocument();
  });

  it("shows a Running status while the input is available", () => {
    renderTool("input-available");
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("shows a Preparing status while streaming", () => {
    renderTool("input-streaming");
    expect(screen.getByText("Preparing")).toBeInTheDocument();
  });

  it("renders the input payload as JSON", () => {
    renderTool("output-available");
    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });

  it("renders the output", () => {
    renderTool("output-available");
    expect(screen.getByText(/3 results/)).toBeInTheDocument();
  });

  it("renders an error instead of an output", () => {
    render(
      <ToolInvocation state="output-error" defaultOpen>
        <ToolInvocationHeader name="search_web" />
        <ToolInvocationContent>
          <ToolInvocationOutput error="upstream timeout" />
        </ToolInvocationContent>
      </ToolInvocation>,
    );
    expect(screen.getByText("upstream timeout")).toBeInTheDocument();
  });

  it("renders nothing for output when neither output nor error is given", () => {
    const { container } = render(<ToolInvocationOutput />);
    expect(container.firstChild).toBeNull();
  });
});
