import { PlaceholderPage } from "@/components/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Command Center"
      title="Dashboard"
      summary="A calm overview for portfolio status, alerts, watchlist movement, reports, and risk signals."
      sections={[
        {
          title: "Portfolio Summary",
          value: "No portfolio data",
          detail: "Portfolio records will be added after the database and transaction batches.",
          tone: "neutral"
        },
        {
          title: "Active Alerts",
          value: "0",
          detail: "Alerts are deferred until watchlist, market data, and alert services exist.",
          tone: "amber"
        },
        {
          title: "Latest Report",
          value: "Not generated",
          detail: "Reports will remain service-backed and durable when implemented.",
          tone: "blue"
        }
      ]}
    />
  );
}
