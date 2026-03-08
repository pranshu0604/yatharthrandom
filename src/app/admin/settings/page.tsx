import { prisma } from "@/lib/prisma";
import { AdminSettingsClient } from "./settings-client";

export const metadata = {
  title: "Platform Settings | Admin | ReMemberX",
};

export default async function AdminSettingsPage() {
  // Fetch platform config (there should be one row)
  const platformConfig = await prisma.platformConfig.findFirst();

  // Fetch tier configs
  const tierConfigs = await prisma.tierConfig.findMany({
    orderBy: { tier: "asc" },
  });

  const config = platformConfig
    ? {
        id: platformConfig.id,
        commissionPercent: platformConfig.commissionPercent,
        featuredListingFee: platformConfig.featuredListingFee,
        flatListingFee: platformConfig.flatListingFee,
      }
    : null;

  const tiers = tierConfigs.map((t) => ({
    id: t.id,
    tier: t.tier,
    maxListings: t.maxListings,
    monthlyPrice: t.monthlyPrice,
    featuredPerMonth: t.featuredPerMonth,
    description: t.description,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">
          Platform Settings
        </h1>
        <p className="text-neutral-500 mt-1">
          Configure commission rates, fees, and seller tier settings.
        </p>
      </div>

      <AdminSettingsClient config={config} tiers={tiers} />
    </div>
  );
}
