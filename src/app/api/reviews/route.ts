import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* GET /api/reviews — List reviews with optional filters               */
/* ------------------------------------------------------------------ */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");
    const listingId = searchParams.get("listingId");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)),
    );

    const where: Prisma.ReviewWhereInput = {};

    if (sellerId) where.sellerId = sellerId;
    if (buyerId) where.buyerId = buyerId;
    if (listingId) where.listingId = listingId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          buyer: {
            select: { id: true, name: true, image: true },
          },
          seller: {
            select: { id: true, name: true, image: true },
          },
          listing: {
            select: { id: true, title: true, images: true },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        buyer: r.buyer,
        seller: r.seller,
        listing: {
          id: r.listing.id,
          title: r.listing.title,
          image: r.listing.images[0] ?? null,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* DELETE /api/reviews — Admin moderation: delete a review             */
/* ------------------------------------------------------------------ */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 },
      );
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
