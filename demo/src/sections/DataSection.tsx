import { MetricCard } from "@/lib/dashboard/metric-card";
import { ActivityFeed } from "@/lib/dashboard/activity-feed";

export default function DataSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Components installed"
          value="12,480"
          trend="up"
          trendValue="+18.2%"
          trendLabel="vs last month"
        />
        <MetricCard
          title="Median install time"
          value="1.4s"
          trend="down"
          trendValue="-0.3s"
          trendLabel="vs last month"
        />
        <MetricCard
          title="Registry errors"
          value="0.02%"
          trend="neutral"
          trendLabel="steady"
        />
      </div>

      <ActivityFeed
        items={[
          {
            id: "1",
            title: "Registry build passed",
            description: "104 items, 7 categories",
            timestamp: "2 minutes ago",
            status: "success",
          },
          {
            id: "2",
            title: "MCP catalog refreshed",
            description: "llms.txt regenerated",
            timestamp: "18 minutes ago",
            status: "info",
          },
          {
            id: "3",
            title: "Missing dependency flagged",
            description: "code-block declares prismjs but never imports it",
            timestamp: "1 hour ago",
            status: "warning",
          },
          {
            id: "4",
            title: "Type check failed",
            description: "marquee.tsx duplicated animate prop",
            timestamp: "yesterday",
            status: "error",
          },
        ]}
      />
    </div>
  );
}
