import { describe, it, expect } from "vitest";

/**
 * Smoke test: every component module must import without throwing.
 *
 * This catches the failure mode unit tests miss — a component that no test
 * exercises but that still breaks for consumers, because it imports a package
 * that was never declared, references a renamed util, or runs bad top-level
 * code. Cheap to run, and it fails loudly at the exact file.
 */
const modules = import.meta.glob("../lib/**/*.{ts,tsx}");

const EXCLUDED = [
  // Needs a Next.js App Router runtime (next/link, next-intl).
  "/lib/docs/",
  // Build-time helpers that read the filesystem.
  "/lib/registry/",
];

const paths = Object.keys(modules).filter(
  (p) => !EXCLUDED.some((ex) => p.includes(ex)),
);

describe("registry smoke", () => {
  it("finds the component modules", () => {
    expect(paths.length).toBeGreaterThan(60);
  });

  it("imports every component module cleanly", async () => {
    const failures: string[] = [];

    for (const path of paths) {
      try {
        // Importing is the assertion. A module with no runtime exports
        // (a pure type file) is still a pass.
        await modules[path]();
      } catch (error) {
        failures.push(`${path} — ${(error as Error).message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
