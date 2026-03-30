import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminReviewsClient } from "./reviews-client";

export const metadata = {
  title: "Manage Reviews | Admin | ReMemberX",
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = 20;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        buyer: { select: { name: true, image: true } },
        seller: { select: { name: true, image: true } },
        listing: { select: { id: true, title: true } },
      },
    }),
    prisma.review.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const serialized = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    buyerName: r.buyer.name,
    buyerImage: r.buyer.image,
    sellerName: r.seller.name,
    sellerImage: r.seller.image,
    listingId: r.listing.id,
    listingTitle: r.listing.title,
    createdAt: formatDate(r.createdAt),
  }));

  return (
    <div>
      <div className="border-b border-neutral-800/60 pb-6 mb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 mb-1">Admin</p>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-2xl font-bold text-white">Reviews</h1>
          <p className="text-sm text-neutral-600">{total} total</p>
        </div>
      </div>

      <Card className="p-0">
        <AdminReviewsClient
          reviews={serialized}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </Card>
    </div>
  );
}
