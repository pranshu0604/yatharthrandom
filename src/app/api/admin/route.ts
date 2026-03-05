import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* GET /api/admin — Aggregated admin dashboard stats                   */
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

    const [
      totalUsers,
      buyerCount,
      sellerCount,
      adminCount,
      totalListings,
      activeListings,
      pendingListings,
      soldListings,
      expiredListings,
      totalTransactions,
      completedTransactions,
      revenueResult,
      avgRatingResult,
      totalReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "BUYER" } }),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.listing.count({ where: { status: "SOLD" } }),
      prisma.listing.count({ where: { status: "EXPIRED" } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: "COMPLETED" } }),
      prisma.transaction.aggregate({
        _sum: { commission: true, amount: true },
        where: { status: "COMPLETED" },
      }),
      prisma.review.aggregate({ _avg: { rating: true } }),
      prisma.review.count(),
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        buyers: buyerCount,
        sellers: sellerCount,
        admins: adminCount,
      },
      listings: {
        total: totalListings,
        active: activeListings,
        pending: pendingListings,
        sold: soldListings,
        expired: expiredListings,
      },
      transactions: {
        total: totalTransactions,
        completed: completedTransactions,
        totalRevenue: revenueResult._sum.amount ?? 0,
        totalCommission: revenueResult._sum.commission ?? 0,
      },
      reviews: {
        total: totalReviews,
        averageRating:
          Math.round((avgRatingResult._avg.rating ?? 0) * 10) / 10,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/admin error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
