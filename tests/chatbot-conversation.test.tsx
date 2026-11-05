import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/lib/chatbot/conversation";

describe("Conversation", () => {
  it("renders its children", () => {
    render(
      <Conversation>
        <ConversationContent>
          <p>first message</p>
        </ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText("first message")).toBeInTheDocument();
  });

  it("applies a custom className", () => {
    const { container } = render(
      <Conversation className="custom-root">
        <ConversationContent>body</ConversationContent>
      </Conversation>,
    );
    expect(container.firstChild).toHaveClass("custom-root");
  });

  it("hides the scroll button while already at the bottom", () => {
    const { container } = render(
      <Conversation>
        <ConversationContent>
          <p>body</p>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>,
    );
    // showScrollButton defaults to false, so nothing is rendered.
    expect(container.querySelector("button")).toBeNull();
  });

  it("throws a helpful error when the scroll button is used outside Conversation", () => {
    // React logs the error boundary noise; silence it for this assertion.
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<ConversationScrollButton />)).toThrow(
      /must be used within a Conversation/,
    );
    console.error = originalError;
  });
});
