import { PlaceholderPage } from "@/components/placeholder-page";

export default function ThemesPage() {
  return (
    <PlaceholderPage
      eyebrow="Themes"
      title="Investment Themes"
      summary="Long-term themes, company links, exposure, and theme risks will be tracked here."
      sections={[
        {
          title: "Theme Library",
          value: "Empty",
          detail: "Manual theme creation is planned before scoring or automation.",
          tone: "neutral"
        },
        {
          title: "Exposure",
          value: "Pending",
          detail: "Theme exposure will depend on portfolio and company mapping services.",
          tone: "amber"
        }
      ]}
    />
  );
}
