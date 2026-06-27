import { PlaceholderPage } from "@/components/placeholder-page";

export default function ResearchPage() {
  return (
    <PlaceholderPage
      eyebrow="Research"
      title="Company Research"
      summary="Company profiles, fundamentals, filings, earnings, and saved research notes will collect here."
      sections={[
        {
          title: "Company Coverage",
          value: "Not started",
          detail: "Research data will come through internal services and provider adapters.",
          tone: "neutral"
        },
        {
          title: "Saved Notes",
          value: "0",
          detail: "Durable notes and reports are deferred until persistence is added.",
          tone: "green"
        }
      ]}
    />
  );
}
