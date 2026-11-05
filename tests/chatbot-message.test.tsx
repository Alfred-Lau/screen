import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message, MessageContent } from "@/lib/chatbot/message";

describe("Message", () => {
  it("renders assistant content", () => {
    render(
      <Message from="assistant">
        <MessageContent>Hello from the model</MessageContent>
      </Message>,
    );
    expect(screen.getByText("Hello from the model")).toBeInTheDocument();
  });

  it("renders user content", () => {
    render(
      <Message from="user">
        <MessageContent variant="user">My question</MessageContent>
      </Message>,
    );
    expect(screen.getByText("My question")).toBeInTheDocument();
  });

  it("renders a custom avatar when provided", () => {
    render(
      <Message from="assistant" avatar={<span data-testid="avatar">AI</span>}>
        <MessageContent>Hi</MessageContent>
      </Message>,
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("shows a formatted timestamp when provided", () => {
    render(
      <Message from="assistant" timestamp="2026-01-02T03:04:00Z">
        <MessageContent>Hi</MessageContent>
      </Message>,
    );
    // Locale-dependent format; assert that something was rendered.
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("omits the timestamp block when no timestamp is given", () => {
    const { container } = render(
      <Message from="assistant">
        <MessageContent>Hi</MessageContent>
      </Message>,
    );
    expect(container.querySelectorAll("span.text-\\[10px\\]")).toHaveLength(0);
  });

  it("renders user messages right-aligned and assistant messages left-aligned", () => {
    const { container: userContainer } = render(
      <Message from="user">
        <MessageContent variant="user">u</MessageContent>
      </Message>,
    );
    expect(userContainer.firstChild).toHaveClass("justify-end");

    const { container: assistantContainer } = render(
      <Message from="assistant">
        <MessageContent>a</MessageContent>
      </Message>,
    );
    expect(assistantContainer.firstChild).toHaveClass("justify-start");
  });
});
