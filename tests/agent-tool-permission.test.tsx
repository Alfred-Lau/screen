import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolPermission } from "@/lib/agent/tool-permission";

function setup(overrides: Partial<React.ComponentProps<typeof ToolPermission>> = {}) {
  const onAllow = vi.fn();
  const onDeny = vi.fn();
  render(
    <ToolPermission
      tool="search_web"
      server="mcp:web"
      risk="high"
      args={[{ label: "query", value: "quarterly report" }]}
      onAllow={onAllow}
      onDeny={onDeny}
      {...overrides}
    />,
  );
  return { onAllow, onDeny };
}

describe("ToolPermission", () => {
  it("renders the tool name, server and arguments", () => {
    setup();
    expect(screen.getByText("search_web")).toBeInTheDocument();
    expect(screen.getByText("mcp:web")).toBeInTheDocument();
    expect(screen.getByText("quarterly report")).toBeInTheDocument();
  });

  it("shows the risk level", () => {
    setup();
    expect(screen.getByText("High risk")).toBeInTheDocument();
  });

  it("calls onAllow with the default scope", async () => {
    const user = userEvent.setup();
    const { onAllow } = setup();
    await user.click(screen.getByText("Allow"));
    expect(onAllow).toHaveBeenCalledWith("once");
  });

  it("calls onAllow with the selected scope", async () => {
    const user = userEvent.setup();
    const { onAllow } = setup();
    await user.click(screen.getByText("This session"));
    await user.click(screen.getByText("Allow"));
    expect(onAllow).toHaveBeenCalledWith("session");
  });

  it("calls onDeny and never onAllow", async () => {
    const user = userEvent.setup();
    const { onAllow, onDeny } = setup();
    await user.click(screen.getByText("Deny"));
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onAllow).not.toHaveBeenCalled();
  });

  it("respects custom labels", () => {
    setup({ allowLabel: "Grant", denyLabel: "Block" });
    expect(screen.getByText("Grant")).toBeInTheDocument();
    expect(screen.getByText("Block")).toBeInTheDocument();
  });

  it("hides the scope picker when no scopes are given", () => {
    setup({ scopes: [] });
    expect(screen.queryByText("Grant for")).not.toBeInTheDocument();
  });

  it("does not crash without callbacks", async () => {
    const user = userEvent.setup();
    render(<ToolPermission tool="noop" />);
    await user.click(screen.getByText("Allow"));
    await user.click(screen.getByText("Deny"));
    expect(screen.getByText("noop")).toBeInTheDocument();
  });
});
