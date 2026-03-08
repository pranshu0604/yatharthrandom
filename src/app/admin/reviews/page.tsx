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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Reviews</h1>
        <p className="text-neutral-500 mt-1">
          Moderate all {total} reviews on the platform.
        </p>
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
