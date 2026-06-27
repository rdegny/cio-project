import { PlaceholderPage } from "@/components/placeholder-page";

export default function WatchlistPage() {
  return (
    <PlaceholderPage
      eyebrow="Watchlist"
      title="Companies To Monitor"
      summary="Target prices, priorities, notes, and watchlist status will be organized here."
      sections={[
        {
          title: "Tracked Companies",
          value: "0",
          detail: "Manual watchlist entry is planned before provider-backed price checks.",
          tone: "neutral"
        },
        {
          title: "Research Targets",
          value: "Pending",
          detail: "Target prices and notes will stay separate from alert delivery.",
          tone: "blue"
        }
      ]}
    />
  );
}
