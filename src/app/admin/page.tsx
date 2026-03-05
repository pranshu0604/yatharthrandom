import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default async function AdminOverviewPage() {
  // Fetch all stats in parallel
  const [
    totalUsers,
    buyerCount,
    sellerCount,
    totalListings,
    activeListings,
    pendingListings,
    soldListings,
    totalTransactions,
    revenueResult,
    avgRatingResult,
    recentListings,
    recentReviews,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.listing.count({ where: { status: "SOLD" } }),
    prisma.transaction.count({ where: { status: "COMPLETED" } }),
    prisma.transaction.aggregate({
      _sum: { commission: true },
      where: { status: "COMPLETED" },
    }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        seller: { select: { name: true, image: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        buyer: { select: { name: true, image: true } },
        listing: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.commission ?? 0;
  const avgRating = Math.round((avgRatingResult._avg.rating ?? 0) * 10) / 10;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: `${buyerCount} buyers, ${sellerCount} sellers`,
      icon: Users,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Total Listings",
      value: totalListings,
      sub: `${activeListings} active, ${pendingListings} pending, ${soldListings} sold`,
      icon: Package,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Transactions",
      value: totalTransactions,
      sub: `${formatCurrency(totalRevenue)} commission earned`,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Average Rating",
      value: avgRating || "N/A",
      sub: "across all reviews",
      icon: Star,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  const statusColorMap: Record<string, "success" | "warning" | "error" | "default" | "secondary"> = {
    ACTIVE: "success",
    PENDING: "warning",
    SOLD: "secondary",
    EXPIRED: "error",
    REJECTED: "error",
  };

  const roleColorMap: Record<string, "default" | "success" | "secondary"> = {
    BUYER: "default",
    SELLER: "success",
    ADMIN: "secondary",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">Dashboard Overview</h1>
        <p className="text-neutral-500 mt-1">
          Key metrics and recent activity across the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-neutral-400 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics Summary */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Key Metrics
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                Revenue
              </p>
              <p className="text-xl font-bold text-neutral-800 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                Pending Approvals
              </p>
              <p className="text-xl font-bold text-neutral-800 mt-1">
                {pendingListings}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                Completion Rate
              </p>
              <p className="text-xl font-bold text-neutral-800 mt-1">
                {totalTransactions > 0
                  ? `${Math.round((totalTransactions / Math.max(soldListings, 1)) * 100)}%`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                Avg. Rating
              </p>
              <p className="text-xl font-bold text-neutral-800 mt-1">
                {avgRating ? `${avgRating} / 5` : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-400" />
              Latest Listings
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentListings.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-6">
                No listings yet.
              </p>
            ) : (
              recentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0"
                >
                  <Avatar
                    name={listing.seller.name}
                    src={listing.seller.image}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {listing.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {listing.seller.name} &middot;{" "}
                      {listing.category.name}
                    </p>
                  </div>
                  <Badge
                    variant={statusColorMap[listing.status] ?? "default"}
                    className="text-[10px]"
                  >
                    {listing.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-neutral-400" />
              Latest Reviews
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReviews.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-6">
                No reviews yet.
              </p>
            ) : (
              recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0"
                >
                  <Avatar
                    name={review.buyer.name}
                    src={review.buyer.image}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {review.listing.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      by {review.buyer.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <Star className="h-3.5 w-3.5 fill-secondary" />
                    <span className="text-xs font-semibold">{review.rating}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-neutral-400" />
              Recent Registrations
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-6">
                No users yet.
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0"
                >
                  <Avatar name={user.name} src={user.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={roleColorMap[user.role] ?? "default"}
                      className="text-[10px]"
                    >
                      {user.role}
                    </Badge>
                    <span className="text-[10px] text-neutral-400">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
