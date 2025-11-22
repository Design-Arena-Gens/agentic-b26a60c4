import { BroadcastDashboard } from "@/components/dashboard/broadcast-dashboard";
import { envConfig } from "@/lib/env";

export default function Home() {
  const platformDescriptors = Object.values(envConfig.platformConfigs).map(
    (config) => ({
      id: config.id,
      label: config.label,
      description: config.description,
      isConfigured: config.isConfigured,
      documentationUrl: config.documentationUrl,
    })
  );

  return (
    <main className="relative mx-auto w-full max-w-7xl px-6 py-16 md:px-10 lg:px-12">
      <BroadcastDashboard platforms={platformDescriptors} />
    </main>
  );
}
