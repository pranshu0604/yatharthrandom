import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar } from "@/components/ui/avatar";
import {
  ListOrdered,
  CheckCircle,
  Eye,
  Star,
  TrendingUp,
  Crown,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const statusBadge: Record<string, { variant: "success" | "warning" | "secondary" | "error" | "outline"; label: string }> = {
  ACTIVE: { variant: "success", label: "Active" },
  PENDING: { variant: "warning", label: "Pending" },
  SOLD: { variant: "secondary", label: "Sold" },
  EXPIRED: { variant: "error", label: "Expired" },
  REJECTED: { variant: "outline", label: "Rejected" },
};

const tierInfo: Record<string, { label: string; color: string }> = {
  BRONZE: { label: "Bronze", color: "text-amber-700" },
  SILVER: { label: "Silver", color: "text-neutral-500" },
  GOLD: { label: "Gold", color: "text-secondary" },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default async function SellerOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SELLER") redirect("/dashboard");

  const userId = session.user.id;

  /* Fetch all data in parallel */
  const [
    totalListings,
    activeListings,
    totalViews,
    reviews,
    recentListings,
    recentReviews,
    tierConfig,
    user,
  ] = await Promise.all([
    prisma.listing.count({ where: { sellerId: userId } }),
    prisma.listing.count({ where: { sellerId: userId, status: "ACTIVE" } }),
    prisma.listing.aggregate({
      where: { sellerId: userId },
      _sum: { views: true },
    }),
    prisma.review.findMany({
      where: { sellerId: userId },
      select: { rating: true },
    }),
    prisma.listing.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        category: { select: { name: true } },
      },
    }),
    prisma.review.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        buyer: { select: { name: true, image: true } },
        listing: { select: { title: true } },
      },
    }),
    prisma.tierConfig.findUnique({
      where: { tier: session.user.tier as "BRONZE" | "SILVER" | "GOLD" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    }),
  ]);

  const viewsTotal = totalViews._sum.views ?? 0;
  const totalReviewCount = reviews.length;
  const avgRating =
    totalReviewCount > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewCount) *
            10,
        ) / 10
      : 0;

  const currentTier = tierInfo[user?.tier ?? "BRONZE"];
  const maxListings = tierConfig?.maxListings ?? 5;
  const featuredAllowed = tierConfig?.featuredPerMonth ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Seller Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Welcome back! Here is an overview of your activity.
          </p>
        </div>
        <Link
          href="/dashboard/seller/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          New Listing
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          icon={<ListOrdered className="h-6 w-6" />}
          title="Total Listings"
          value={totalListings}
          subtitle={`of ${maxListings} allowed`}
          delay={0}
        />
        <StatsCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="Active Listings"
          value={activeListings}
          delay={0.05}
        />
        <StatsCard
          icon={<Eye className="h-6 w-6" />}
          title="Total Views"
          value={viewsTotal.toLocaleString("en-IN")}
          delay={0.1}
        />
        <StatsCard
          icon={<Star className="h-6 w-6" />}
          title="Total Reviews"
          value={totalReviewCount}
          delay={0.15}
        />
        <StatsCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Avg. Rating"
          value={avgRating > 0 ? avgRating.toFixed(1) : "--"}
          subtitle={
            totalReviewCount > 0 ? `from ${totalReviewCount} reviews` : ""
          }
          delay={0.2}
        />
      </div>

      {/* Tier status + Recent listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className={`h-5 w-5 ${currentTier.color}`} />
              <h2 className="text-lg font-semibold text-neutral-900">
                {currentTier.label} Tier
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Listings Used</span>
                <span className="font-medium text-neutral-900">
                  {totalListings} / {maxListings}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (totalListings / maxListings) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Featured / month</span>
              <span className="font-medium text-neutral-900">
                {featuredAllowed}
              </span>
            </div>

            {user?.tier !== "GOLD" && (
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-sm text-neutral-600 mb-2">
                  Upgrade to unlock more listings, featured slots, and priority
                  visibility.
                </p>
                <Link
                  href="/dashboard/seller/settings"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  View upgrade options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent listings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Recent Listings
              </h2>
              <Link
                href="/dashboard/seller/listings"
                className="text-sm text-accent hover:underline font-medium"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentListings.length === 0 ? (
              <div className="text-center py-8">
                <ListOrdered className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
                <p className="text-neutral-500 text-sm">
                  No listings yet. Create your first listing to get started!
                </p>
                <Link
                  href="/dashboard/seller/listings/new"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-accent hover:underline"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentListings.map((listing) => {
                  const badge = statusBadge[listing.status] ?? statusBadge.PENDING;
                  return (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {listing.images?.[0] ? (
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={listing.images[0]}
                              alt={listing.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                            <ListOrdered className="h-4 w-4 text-neutral-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/seller/listings/${listing.id}/edit`}
                            className="text-sm font-medium text-neutral-900 truncate block hover:text-primary transition-colors"
                          >
                            {listing.title}
                          </Link>
                          <p className="text-xs text-neutral-500">
                            {listing.category.name} &middot;{" "}
                            {formatCurrency(listing.askingPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className="text-xs text-neutral-400 hidden sm:block">
                          {formatDate(listing.createdAt)}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Recent Reviews
            </h2>
            <Link
              href="/dashboard/seller/reviews"
              className="text-sm text-accent hover:underline font-medium"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500 text-sm">
                No reviews yet. Reviews will appear here once buyers rate your
                listings.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recentReviews.map((review) => (
                <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={review.buyer.name}
                      src={review.buyer.image}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-neutral-900">
                          {review.buyer.name}
                        </p>
                        <StarRating
                          value={review.rating}
                          starClassName="h-4 w-4"
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        on{" "}
                        <span className="font-medium">
                          {review.listing.title}
                        </span>{" "}
                        &middot; {formatDate(review.createdAt)}
                      </p>
                      {review.comment && (
                        <p className="text-sm text-neutral-600 mt-1.5">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
