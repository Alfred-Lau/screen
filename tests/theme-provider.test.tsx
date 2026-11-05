import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ThemeProvider,
  useTheme,
  THEME_STORAGE_KEY,
} from "@/lib/theme-provider";

function Consumer() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="effective">{effectiveTheme}</span>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("defaults to the system theme", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("applies the dark class when the theme is dark", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("set-dark"));
    expect(document.documentElement).toHaveClass("dark");
  });

  it("persists the choice under the documented storage key", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    await user.click(screen.getByText("set-dark"));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("restores a stored theme on mount", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("ignores an invalid stored value", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "neon");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("cycles system → light → dark → system on toggle", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    await act(async () => {
      await user.click(screen.getByText("toggle"));
    });
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    await act(async () => {
      await user.click(screen.getByText("toggle"));
    });
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    await act(async () => {
      await user.click(screen.getByText("toggle"));
    });
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("degrades to defaults instead of throwing outside the provider", () => {
    render(<Consumer />);
    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("effective")).toHaveTextContent("light");
  });
});
