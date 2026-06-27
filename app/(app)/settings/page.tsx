import { PlaceholderPage } from "@/components/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Settings"
      title="Preferences"
      summary="Local configuration, notification preferences, default currency, and report cadence will be managed here."
      sections={[
        {
          title: "Environment",
          value: "Local",
          detail: "Only placeholder environment values are committed in this batch.",
          tone: "blue"
        },
        {
          title: "Preferences",
          value: "Pending",
          detail: "User settings will be persisted after auth and database setup.",
          tone: "neutral"
        }
      ]}
    />
  );
}
