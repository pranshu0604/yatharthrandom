import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
  Search,
  Heart,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Buyer Dashboard | ReMemberX",
};

export default async function BuyerDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all data in parallel
  const [savedCount, purchaseCount, reviewCount, savedListings, transactions] =
    await Promise.all([
      prisma.savedListing.count({ where: { userId } }),
      prisma.transaction.count({
        where: { buyerId: userId, status: "COMPLETED" },
      }),
      prisma.review.count({ where: { buyerId: userId } }),
      prisma.savedListing.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              askingPrice: true,
              images: true,
              city: true,
              status: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
      prisma.transaction.findMany({
        where: { buyerId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              images: true,
            },
          },
          seller: {
            select: { name: true },
          },
        },
      }),
    ]);

  const stats = [
    {
      label: "Saved Listings",
      value: savedCount,
      icon: Bookmark,
      color: "text-secondary",
      bg: "bg-secondary/15",
    },
    {
      label: "Completed Purchases",
      value: purchaseCount,
      icon: ShoppingBag,
      color: "text-accent",
      bg: "bg-accent/15",
    },
    {
      label: "Reviews Written",
      value: reviewCount,
      icon: MessageSquare,
      color: "text-white",
      bg: "bg-white/10",
    },
  ];

  const statusColorMap: Record<string, "success" | "warning" | "error" | "default"> = {
    COMPLETED: "success",
    PENDING: "warning",
    CANCELLED: "error",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-neutral-100">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="text-neutral-500 mt-1">
          Here is an overview of your activity on ReMemberX.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-100">
                  {stat.value}
                </p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="primary" size="md" asChild>
          <Link href="/marketplace" className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Marketplace
          </Link>
        </Button>
        <Button variant="outline" size="md" asChild>
          <Link
            href="/dashboard/buyer/saved"
            className="inline-flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            View Saved
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-100">
                  Saved Listings
                </h2>
                {savedCount > 6 && (
                  <Link
                    href="/dashboard/buyer/saved"
                    className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {savedListings.length === 0 ? (
                <div className="text-center py-10">
                  <Bookmark className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">
                    You have not saved any listings yet.
                  </p>
                  <Link
                    href="/marketplace"
                    className="text-sm text-accent hover:underline mt-2 inline-block"
                  >
                    Browse the marketplace
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedListings.map((saved) => (
                    <Link
                      key={saved.id}
                      href={`/listing/${saved.listing.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-neutral-800 p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                        {saved.listing.images[0] ? (
                          <Image
                            src={saved.listing.images[0]}
                            alt={saved.listing.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-100 truncate group-hover:text-accent transition-colors">
                          {saved.listing.title}
                        </p>
                        <p className="text-sm font-bold text-white">
                          {formatCurrency(saved.listing.askingPrice)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-neutral-500">
                            {saved.listing.category.name}
                          </span>
                          <span className="text-neutral-300">|</span>
                          <span className="text-xs text-neutral-500">
                            {saved.listing.city}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-neutral-100">
                Recent Transactions
              </h2>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">
                    No transactions yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 rounded-lg border border-neutral-800 p-3"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                        {tx.listing.images[0] ? (
                          <Image
                            src={tx.listing.images[0]}
                            alt={tx.listing.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400 text-[10px]">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-100 truncate">
                          {tx.listing.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          from {tx.seller.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-neutral-100">
                          {formatCurrency(tx.amount)}
                        </p>
                        <Badge
                          variant={statusColorMap[tx.status] ?? "default"}
                          className="text-[10px] mt-0.5"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
