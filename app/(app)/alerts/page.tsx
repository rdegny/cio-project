import { PlaceholderPage } from "@/components/placeholder-page";

export default function AlertsPage() {
  return (
    <PlaceholderPage
      eyebrow="Alerts"
      title="Attention Queue"
      summary="Explainable price, risk, earnings, news, and watchlist alerts will appear here."
      sections={[
        {
          title: "Open Alerts",
          value: "0",
          detail: "Alert rules and notification delivery are intentionally deferred.",
          tone: "green"
        },
        {
          title: "Severity",
          value: "Calm",
          detail: "Alerts should explain why they matter without panic language.",
          tone: "blue"
        }
      ]}
    />
  );
}
