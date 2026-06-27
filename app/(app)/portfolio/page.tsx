import { PlaceholderPage } from "@/components/placeholder-page";

export default function PortfolioPage() {
  return (
    <PlaceholderPage
      eyebrow="Portfolio"
      title="Holdings"
      summary="Current holdings, allocation, gain/loss, and position-level risk will live here."
      sections={[
        {
          title: "Holdings",
          value: "No holdings",
          detail: "Transactions remain the planned source of truth for portfolio history.",
          tone: "neutral"
        },
        {
          title: "Allocation",
          value: "Pending",
          detail: "Allocation views will use prepared service data, not component calculations.",
          tone: "green"
        }
      ]}
    />
  );
}
