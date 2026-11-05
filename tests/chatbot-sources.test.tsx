import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@/lib/chatbot/sources";

function renderSources() {
  return render(
    <Sources>
      <SourcesTrigger count={2} />
      <SourcesContent>
        <Source href="https://example.com/a" title="Example A" />
        <Source href="https://docs.example.org/b" title="Example B" />
      </SourcesContent>
    </Sources>,
  );
}

describe("Sources", () => {
  it("starts collapsed and hides the content", () => {
    renderSources();
    expect(screen.getByText("Sources")).toBeInTheDocument();
    expect(screen.queryByText("Example A")).not.toBeInTheDocument();
  });

  it("expands on trigger click", async () => {
    const user = userEvent.setup();
    renderSources();
    await user.click(screen.getByText("Sources"));
    expect(screen.getByText("Example A")).toBeInTheDocument();
    expect(screen.getByText("Example B")).toBeInTheDocument();
  });

  it("shows the count badge", () => {
    renderSources();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders the domain instead of the raw URL", async () => {
    const user = userEvent.setup();
    renderSources();
    await user.click(screen.getByText("Sources"));
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  // Security invariant: external links must not leak window.opener.
  it("opens external links with noopener noreferrer", async () => {
    const user = userEvent.setup();
    renderSources();
    await user.click(screen.getByText("Sources"));

    const link = screen.getByText("Example A").closest("a");
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not throw on an invalid URL", async () => {
    const user = userEvent.setup();
    render(
      <Sources defaultOpen>
        <SourcesTrigger />
        <SourcesContent>
          <Source href="not a url" title="Broken" />
        </SourcesContent>
      </Sources>,
    );
    expect(screen.getByText("Broken")).toBeInTheDocument();
  });
});
