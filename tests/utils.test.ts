import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values", () => {
    expect(cn("flex", false, null, undefined, "", "gap-2")).toBe("flex gap-2");
  });

  it("resolves Tailwind conflicts with the last one winning", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("supports conditional objects", () => {
    expect(cn({ "bg-red-500": true, "bg-blue-500": false })).toBe("bg-red-500");
  });

  it("supports array input", () => {
    expect(cn(["p-1", "p-2"])).toBe("p-2");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("rounded-lg", "px-4", "text-sm")).toBe("rounded-lg px-4 text-sm");
  });
});
