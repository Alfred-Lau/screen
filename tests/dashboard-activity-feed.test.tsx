import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "@/lib/dashboard/activity-feed";

const items = [
  { id: "1", title: "Deploy finished", timestamp: "2 minutes ago", status: "success" as const },
  { id: "2", title: "Build started", description: "commit 1e80407", timestamp: "5 minutes ago", status: "info" as const },
  { id: "3", title: "Quota warning", timestamp: "1 hour ago", status: "warning" as const },
];

describe("ActivityFeed", () => {
  it("renders every item title", () => {
    render(<ActivityFeed items={items} />);
    expect(screen.getByText("Deploy finished")).toBeInTheDocument();
    expect(screen.getByText("Build started")).toBeInTheDocument();
    expect(screen.getByText("Quota warning")).toBeInTheDocument();
  });

  it("renders item descriptions and timestamps", () => {
    render(<ActivityFeed items={items} />);
    expect(screen.getByText("commit 1e80407")).toBeInTheDocument();
    expect(screen.getByText("2 minutes ago")).toBeInTheDocument();
  });

  it("renders the empty message when there are no items", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("accepts a custom empty message", () => {
    render(<ActivityFeed items={[]} emptyMessage="Nothing happened" />);
    expect(screen.getByText("Nothing happened")).toBeInTheDocument();
  });

  it("renders a skeleton while loading", () => {
    const { container } = render(<ActivityFeed items={items} loading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByText("Deploy finished")).not.toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(<ActivityFeed items={items} className="custom-feed" />);
    expect(container.firstChild).toHaveClass("custom-feed");
  });
});
