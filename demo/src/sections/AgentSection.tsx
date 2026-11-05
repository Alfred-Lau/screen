import { useState } from "react";
import { ToolPermission } from "@/lib/agent/tool-permission";
import {
  ApprovalCard,
  type ApprovalDecision,
} from "@/lib/agent/approval";

export default function AgentSection() {
  const [decision, setDecision] = useState<ApprovalDecision | null>(null);
  const [lastScope, setLastScope] = useState<string | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <ToolPermission
          tool="write_file"
          server="mcp:workspace"
          risk="high"
          args={[
            { label: "path", value: "src/lib/planner.ts" },
            { label: "mode", value: "overwrite" },
          ]}
          onAllow={(scope) => setLastScope(scope)}
          onDeny={() => setLastScope("denied")}
        />
        <p className="text-xs text-muted-foreground">
          last decision:{" "}
          <span className="font-mono text-foreground">{lastScope ?? "—"}</span>
        </p>
      </div>

      <div className="space-y-3">
        <ApprovalCard
          request={{
            title: "Deploy to production",
            description:
              "Ship build 1.8.4 to screen.solokit.run. This replaces the current live bundle.",
            risk: "high",
            agent: "release-bot",
            preview: "vercel deploy --prod",
            reason: "The run cannot continue without a target environment.",
            expiresIn: 90,
          }}
          decision={decision}
          onDecide={setDecision}
        />
        <button
          onClick={() => setDecision(null)}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          reset decision
        </button>
      </div>
    </div>
  );
}
