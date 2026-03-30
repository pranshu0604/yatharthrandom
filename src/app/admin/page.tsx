import Link from "next/link";
import {
  Users,
  Package,
  DollarSign,
  Star,
  Clock,
  UserPlus,
  MessageSquare,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default async function AdminOverviewPage() {
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
    pendingForApproval,
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
      take: 4,
      include: {
        buyer: { select: { name: true, image: true } },
        listing: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.listing.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 3,
      include: {
        seller: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.commission ?? 0;
  const avgRating = Math.round((avgRatingResult._avg.rating ?? 0) * 10) / 10;

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
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-neutral-800/60 pb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 mb-1">Admin</p>
        <h1 className="font-serif text-2xl font-bold text-white">Overview</h1>
      </div>

      {/* Pending approvals alert strip */}
      {pendingListings > 0 && (
        <div className="flex items-center justify-between gap-4 border-l-2 border-warning bg-warning/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-warning shrink-0" />
            <p className="text-sm font-medium text-neutral-200">
              <span className="text-warning font-bold">{pendingListings}</span> listing{pendingListings !== 1 ? "s" : ""} waiting for approval
            </p>
          </div>
          <Link
            href="/admin/listings?status=PENDING"
            className="flex items-center gap-1.5 text-xs font-semibold text-warning hover:text-warning/80 transition-colors shrink-0"
          >
            Review <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Stats — typography-driven, no icon boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800/40">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            sub: `${buyerCount} buyers · ${sellerCount} sellers`,
            icon: Users,
            href: "/admin/users",
          },
          {
            label: "Listings",
            value: totalListings,
            sub: `${activeListings} active · ${pendingListings} pending · ${soldListings} sold`,
            icon: Package,
            href: "/admin/listings",
          },
          {
            label: "Transactions",
            value: totalTransactions,
            sub: `${formatCurrency(totalRevenue)} commission`,
            icon: DollarSign,
            href: "/admin/listings?status=SOLD",
          },
          {
            label: "Avg. Rating",
            value: avgRating || "—",
            sub: "across all reviews",
            icon: Star,
            href: "/admin/reviews",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-neutral-900/60 px-6 py-6 hover:bg-neutral-900 transition-colors"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600 mb-3">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">{stat.value}</p>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{stat.sub}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-neutral-700 group-hover:text-neutral-400 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Pending approvals — quick action cards */}
      {pendingForApproval.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-600" />
              Needs Approval
            </h2>
            <Link href="/admin/listings?status=PENDING" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800/40">
            {pendingForApproval.map((listing) => (
              <Link
                key={listing.id}
                href="/admin/listings?status=PENDING"
                className="bg-neutral-900/60 px-5 py-4 hover:bg-neutral-900 transition-colors group"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-600 mb-1">{listing.category.name}</p>
                <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors line-clamp-1">{listing.title}</p>
                <p className="text-xs text-neutral-600 mt-1">by {listing.seller.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <div className="bg-neutral-900/40 border border-neutral-800/60">
          <div className="px-5 py-4 border-b border-neutral-800/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-600" />
              Latest Listings
            </h2>
            <Link href="/admin/listings" className="text-[11px] text-neutral-600 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/40">
            {recentListings.length === 0 ? (
              <p className="text-sm text-neutral-600 text-center py-8">No listings yet.</p>
            ) : (
              recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={listing.seller.name} src={listing.seller.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">{listing.title}</p>
                    <p className="text-xs text-neutral-600">{listing.seller.name} · {listing.category.name}</p>
                  </div>
                  <Badge variant={statusColorMap[listing.status] ?? "default"} className="text-[10px] shrink-0">
                    {listing.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-neutral-900/40 border border-neutral-800/60">
          <div className="px-5 py-4 border-b border-neutral-800/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-neutral-600" />
              Latest Reviews
            </h2>
            <Link href="/admin/reviews" className="text-[11px] text-neutral-600 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/40">
            {recentReviews.length === 0 ? (
              <p className="text-sm text-neutral-600 text-center py-8">No reviews yet.</p>
            ) : (
              recentReviews.map((review) => (
                <div key={review.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={review.buyer.name} src={review.buyer.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">{review.listing.title}</p>
                    <p className="text-xs text-neutral-600">by {review.buyer.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-secondary shrink-0">
                    <Star className="h-3.5 w-3.5 fill-secondary" />
                    <span className="text-xs font-semibold">{review.rating}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-neutral-900/40 border border-neutral-800/60">
          <div className="px-5 py-4 border-b border-neutral-800/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-neutral-600" />
              New Users
            </h2>
            <Link href="/admin/users" className="text-[11px] text-neutral-600 hover:text-white transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/40">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-neutral-600 text-center py-8">No users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={user.name} src={user.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">{user.name}</p>
                    <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={roleColorMap[user.role] ?? "default"} className="text-[10px]">
                      {user.role}
                    </Badge>
                    <span className="text-[10px] text-neutral-600">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
