import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/lib/dashboard/metric-card";

describe("MetricCard", () => {
  it("renders title and value", () => {
    render(<MetricCard title="Installs" value="12,480" />);
    expect(screen.getByText("Installs")).toBeInTheDocument();
    expect(screen.getByText("12,480")).toBeInTheDocument();
  });

  it("accepts a numeric value", () => {
    render(<MetricCard title="Errors" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders a trend value and label", () => {
    render(
      <MetricCard
        title="Installs"
        value="12,480"
        trend="up"
        trendValue="+18.2%"
        trendLabel="vs last month"
      />,
    );
    expect(screen.getByText("+18.2%")).toBeInTheDocument();
    expect(screen.getByText(/vs last month/)).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<MetricCard title="Latency" value="1.4s" description="p50 across regions" />);
    expect(screen.getByText("p50 across regions")).toBeInTheDocument();
  });

  it("renders a loading state instead of the value", () => {
    const { container } = render(<MetricCard title="Installs" value="12,480" loading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("renders an icon when provided", () => {
    render(
      <MetricCard title="Installs" value="1" icon={<span data-testid="icon">i</span>} />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    const { container } = render(
      <MetricCard title="Installs" value="1" className="custom-card" />,
    );
    expect(container.firstChild).toHaveClass("custom-card");
  });
});
