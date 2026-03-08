"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Percent, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface PlatformConfig {
  id: string;
  commissionPercent: number;
  featuredListingFee: number;
  flatListingFee: number;
}

interface TierConfig {
  id: string;
  tier: string;
  maxListings: number;
  monthlyPrice: number;
  featuredPerMonth: number;
  description: string | null;
}

interface Props {
  config: PlatformConfig | null;
  tiers: TierConfig[];
}

const tierColorMap: Record<string, string> = {
  BRONZE: "bg-amber-700/10 text-amber-700",
  SILVER: "bg-neutral-400/10 text-neutral-400",
  GOLD: "bg-secondary/15 text-secondary",
};

export function AdminSettingsClient({ config, tiers }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Platform config state
  const [commissionPercent, setCommissionPercent] = useState(
    config?.commissionPercent ?? 5,
  );
  const [featuredListingFee, setFeaturedListingFee] = useState(
    config?.featuredListingFee ?? 499,
  );
  const [flatListingFee, setFlatListingFee] = useState(
    config?.flatListingFee ?? 0,
  );

  // Tier configs state
  const [tierEdits, setTierEdits] = useState<Record<string, TierConfig>>(
    Object.fromEntries(tiers.map((t) => [t.id, { ...t }])),
  );

  const updateTier = (id: string, field: keyof TierConfig, value: string) => {
    setTierEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]:
          field === "maxListings" || field === "monthlyPrice" || field === "featuredPerMonth"
            ? parseFloat(value) || 0
            : value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformConfig: {
            commissionPercent,
            featuredListingFee,
            flatListingFee,
          },
          tierConfigs: Object.values(tierEdits).map((t) => ({
            id: t.id,
            maxListings: t.maxListings,
            monthlyPrice: t.monthlyPrice,
            featuredPerMonth: t.featuredPerMonth,
            description: t.description,
          })),
        }),
      });
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Config */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <Percent className="h-5 w-5 text-accent" />
            Platform Fees
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Commission Percentage (%)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={commissionPercent}
              onChange={(e) =>
                setCommissionPercent(parseFloat(e.target.value) || 0)
              }
              leftIcon={<Percent className="h-4 w-4" />}
            />
            <Input
              label="Featured Listing Fee"
              type="number"
              step="1"
              min="0"
              value={featuredListingFee}
              onChange={(e) =>
                setFeaturedListingFee(parseFloat(e.target.value) || 0)
              }
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
            <Input
              label="Flat Listing Fee"
              type="number"
              step="1"
              min="0"
              value={flatListingFee}
              onChange={(e) =>
                setFlatListingFee(parseFloat(e.target.value) || 0)
              }
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tier Configuration */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-secondary" />
            Seller Tier Configuration
          </h2>
        </CardHeader>
        <CardContent>
          {tiers.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-6">
              No tier configurations found. They will be created when you save.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Max Listings
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Monthly Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Featured / Month
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {tiers.map((tier) => {
                    const edit = tierEdits[tier.id];
                    if (!edit) return null;
                    return (
                      <tr key={tier.id} className="hover:bg-neutral-950/60">
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              tierColorMap[tier.tier] ??
                                "bg-neutral-800 text-neutral-400",
                            )}
                          >
                            {tier.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={edit.maxListings}
                            onChange={(e) =>
                              updateTier(tier.id, "maxListings", e.target.value)
                            }
                            className="w-24 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={edit.monthlyPrice}
                            onChange={(e) =>
                              updateTier(
                                tier.id,
                                "monthlyPrice",
                                e.target.value,
                              )
                            }
                            className="w-28 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={edit.featuredPerMonth}
                            onChange={(e) =>
                              updateTier(
                                tier.id,
                                "featuredPerMonth",
                                e.target.value,
                              )
                            }
                            className="w-20 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={edit.description ?? ""}
                            onChange={(e) =>
                              updateTier(
                                tier.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Description"
                            className="w-full min-w-40 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={loading}
        >
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
        {success && (
          <span className="text-sm text-success font-medium">
            Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
}
