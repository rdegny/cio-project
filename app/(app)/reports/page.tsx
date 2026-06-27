import { PlaceholderPage } from "@/components/placeholder-page";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      eyebrow="Reports"
      title="Research Reports"
      summary="Morning briefs, market-close notes, weekly reviews, and company research reports will be stored here."
      sections={[
        {
          title: "Generated Reports",
          value: "0",
          detail: "Report generation waits for data, AI, and persistence foundations.",
          tone: "neutral"
        },
        {
          title: "Review Status",
          value: "Clear",
          detail: "Reports will be skimmable and durable when implemented.",
          tone: "green"
        }
      ]}
    />
  );
}
