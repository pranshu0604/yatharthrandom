import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Prisma } from "@prisma/client";
import {
  PlusCircle,
  ListOrdered,
  Eye,
  Pencil,
  Star,
} from "lucide-react";
import { ListingActions } from "./listing-actions";

/* ------------------------------------------------------------------ */
/* Status badge mapping                                                */
/* ------------------------------------------------------------------ */
const statusBadge: Record<
  string,
  { variant: "success" | "warning" | "secondary" | "error" | "outline"; label: string }
> = {
  ACTIVE: { variant: "success", label: "Active" },
  PENDING: { variant: "warning", label: "Pending" },
  SOLD: { variant: "secondary", label: "Sold" },
  EXPIRED: { variant: "error", label: "Expired" },
  REJECTED: { variant: "outline", label: "Rejected" },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default async function SellerListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SELLER") redirect("/dashboard");

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status ?? "ALL";

  const userId = session.user.id;

  /* Build where clause */
  const where: Prisma.ListingWhereInput = {
    sellerId: userId,
  };

  if (statusFilter !== "ALL") {
    where.status = statusFilter as Prisma.ListingWhereInput["status"];
  }

  /* Fetch listings and tier config in parallel */
  const [listings, tierConfig] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.tierConfig.findUnique({
      where: { tier: session.user.tier as "BRONZE" | "SILVER" | "GOLD" },
    }),
  ]);

  const canFeature = (tierConfig?.featuredPerMonth ?? 0) > 0;
  const statusOptions = ["ALL", "ACTIVE", "PENDING", "SOLD", "EXPIRED", "REJECTED"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <p className="text-neutral-500 mt-1">
            Manage all your membership listings.
          </p>
        </div>
        <Link
          href="/dashboard/seller/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Listing
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <Link
            key={opt}
            href={
              opt === "ALL"
                ? "/dashboard/seller/listings"
                : `/dashboard/seller/listings?status=${opt}`
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === opt
                ? "bg-white text-neutral-900"
                : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-950"
            }`}
          >
            {opt === "ALL" ? "All" : opt.charAt(0) + opt.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {/* Listings table/cards */}
      {listings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <ListOrdered className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-300 mb-1">
              No listings found
            </h3>
            <p className="text-neutral-500 text-sm mb-4">
              {statusFilter !== "ALL"
                ? `You have no ${statusFilter.toLowerCase()} listings.`
                : "Create your first listing to start selling memberships."}
            </p>
            <Link
              href="/dashboard/seller/listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:brightness-110 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Create Listing
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          {/* Desktop table header */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-950 border-b border-neutral-800 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <div className="col-span-4">Listing</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Price</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-1 text-center">Reviews</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            {listings.map((listing) => {
              const badge = statusBadge[listing.status] ?? statusBadge.PENDING;
              return (
                <div
                  key={listing.id}
                  className="px-6 py-4 hover:bg-neutral-950/50 transition-colors"
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                    {/* Listing info */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      {listing.images?.[0] ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                          <ListOrdered className="h-5 w-5 text-neutral-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(listing.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <span className="text-sm text-neutral-400">
                        {listing.category.name}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 text-right">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(listing.askingPrice)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>

                    {/* Views */}
                    <div className="col-span-1 text-center">
                      <span className="text-sm text-neutral-400 inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {listing.views}
                      </span>
                    </div>

                    {/* Reviews */}
                    <div className="col-span-1 text-center">
                      <span className="text-sm text-neutral-400 inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {listing._count.reviews}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/seller/listings/${listing.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-950 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <ListingActions
                        listingId={listing.id}
                        status={listing.status}
                        featured={listing.featured}
                        canFeature={canFeature}
                      />
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      {listing.images?.[0] ? (
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                          <ListOrdered className="h-6 w-6 text-neutral-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {listing.title}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {listing.category.name} &middot;{" "}
                          {formatDate(listing.createdAt)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                          <span className="text-sm font-medium text-white">
                            {formatCurrency(listing.askingPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> {listing.views} views
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />{" "}
                          {listing._count.reviews} reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/seller/listings/${listing.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-950 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <ListingActions
                          listingId={listing.id}
                          status={listing.status}
                          featured={listing.featured}
                          canFeature={canFeature}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
