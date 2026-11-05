import { useTheme } from "@/lib/theme-provider";
import ChatSection from "./sections/ChatSection";
import AgentSection from "./sections/AgentSection";
import DataSection from "./sections/DataSection";

function Section({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-12">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground">{count}</span>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const { effectiveTheme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-border py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Screen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            React components for AI products — live demo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden gap-4 text-sm text-muted-foreground sm:flex">
            <a href="#chat" className="hover:text-foreground">Chat</a>
            <a href="#agent" className="hover:text-foreground">Agent</a>
            <a href="#data" className="hover:text-foreground">Data</a>
          </nav>
          <button
            onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
            aria-label="Toggle theme"
          >
            {effectiveTheme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <Section id="chat" title="Chat primitives" count="conversation · message · reasoning · sources · code-block">
        <ChatSection />
      </Section>

      <Section id="agent" title="Agent surfaces" count="tool-permission · approval">
        <AgentSection />
      </Section>

      <Section id="data" title="Dashboard" count="metric-card · activity-feed">
        <DataSection />
      </Section>

      <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
        Rendered from source in <code className="font-mono">lib/</code> — no build step, no wrapper layer.
      </footer>
    </div>
  );
}
