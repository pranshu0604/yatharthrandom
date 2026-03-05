import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* GET /api/admin/settings — Get platform & tier configs               */
/* ------------------------------------------------------------------ */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [platformConfig, tierConfigs] = await Promise.all([
      prisma.platformConfig.findFirst(),
      prisma.tierConfig.findMany({ orderBy: { tier: "asc" } }),
    ]);

    return NextResponse.json({ platformConfig, tierConfigs });
  } catch (error) {
    console.error("[API] GET /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* PATCH /api/admin/settings — Update platform & tier configs          */
/* ------------------------------------------------------------------ */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { platformConfig, tierConfigs } = body;

    // Update or create platform config
    if (platformConfig) {
      const existing = await prisma.platformConfig.findFirst();
      if (existing) {
        await prisma.platformConfig.update({
          where: { id: existing.id },
          data: {
            commissionPercent: platformConfig.commissionPercent,
            featuredListingFee: platformConfig.featuredListingFee,
            flatListingFee: platformConfig.flatListingFee,
          },
        });
      } else {
        await prisma.platformConfig.create({
          data: {
            commissionPercent: platformConfig.commissionPercent ?? 5,
            featuredListingFee: platformConfig.featuredListingFee ?? 499,
            flatListingFee: platformConfig.flatListingFee ?? 0,
          },
        });
      }
    }

    // Update tier configs
    if (tierConfigs && Array.isArray(tierConfigs)) {
      for (const tier of tierConfigs) {
        if (tier.id) {
          await prisma.tierConfig.update({
            where: { id: tier.id },
            data: {
              maxListings: tier.maxListings,
              monthlyPrice: tier.monthlyPrice,
              featuredPerMonth: tier.featuredPerMonth,
              description: tier.description || null,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PATCH /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
