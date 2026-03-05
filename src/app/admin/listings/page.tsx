import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminListingsClient } from "./listings-client";

export const metadata = {
  title: "Manage Listings | Admin | ReMemberX",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = 20;

  const where: Prisma.ListingWhereInput = {};

  if (
    statusFilter &&
    ["PENDING", "ACTIVE", "SOLD", "EXPIRED", "REJECTED"].includes(statusFilter)
  ) {
    where.status = statusFilter as "PENDING" | "ACTIVE" | "SOLD" | "EXPIRED" | "REJECTED";
  }

  const [listings, total, pendingCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [
        { status: "asc" }, // PENDING comes first alphabetically
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seller: { select: { name: true, image: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.listing.count({ where }),
    prisma.listing.count({ where: { status: "PENDING" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const serialized = listings.map((l) => ({
    id: l.id,
    title: l.title,
    image: l.images[0] ?? null,
    sellerName: l.seller.name,
    sellerImage: l.seller.image,
    categoryName: l.category.name,
    askingPrice: l.askingPrice,
    priceFormatted: formatCurrency(l.askingPrice),
    status: l.status,
    featured: l.featured,
    views: l.views,
    createdAt: formatDate(l.createdAt),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Listings</h1>
        <p className="text-neutral-500 mt-1">
          Manage all {total} listings.
          {pendingCount > 0 && (
            <span className="text-warning font-medium">
              {" "}
              {pendingCount} pending approval.
            </span>
          )}
        </p>
      </div>

      <Card className="p-0">
        <AdminListingsClient
          listings={serialized}
          statusFilter={statusFilter}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </Card>
    </div>
  );
}
