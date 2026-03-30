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
      <div className="border-b border-neutral-800/60 pb-6 mb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 mb-1">Admin</p>
        <h1 className="font-serif text-2xl font-bold text-white">Settings</h1>
      </div>

      <AdminSettingsClient config={config} tiers={tiers} />
    </div>
  );
}
