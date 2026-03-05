import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* GET /api/listings/[id]                                             */
/* Returns a single listing with all relations                        */
/* ------------------------------------------------------------------ */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            city: true,
            state: true,
            tier: true,
            createdAt: true,
            reviewsReceived: {
              select: { rating: true },
            },
          },
        },
        reviews: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 },
      );
    }

    /* Increment view count (fire-and-forget) */
    prisma.listing
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {
        /* silent fail */
      });

    /* Compute seller stats */
    const sellerReviews = listing.seller.reviewsReceived;
    const sellerAvgRating =
      sellerReviews.length > 0
        ? Math.round(
            (sellerReviews.reduce((sum, r) => sum + r.rating, 0) /
              sellerReviews.length) *
              10,
          ) / 10
        : 0;

    /* Compute listing review stats */
    const listingAvgRating =
      listing.reviews.length > 0
        ? Math.round(
            (listing.reviews.reduce((sum, r) => sum + r.rating, 0) /
              listing.reviews.length) *
              10,
          ) / 10
        : 0;

    /* Transform response */
    const response = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      originalPrice: listing.originalPrice,
      askingPrice: listing.askingPrice,
      city: listing.city,
      state: listing.state,
      membershipType: listing.membershipType,
      duration: listing.duration,
      expiryDate: listing.expiryDate?.toISOString() ?? null,
      images: listing.images,
      status: listing.status,
      featured: listing.featured,
      views: listing.views + 1, // include the current view
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      category: {
        id: listing.category.id,
        name: listing.category.name,
        slug: listing.category.slug,
      },
      seller: {
        id: listing.seller.id,
        name: listing.seller.name,
        image: listing.seller.image,
        city: listing.seller.city,
        state: listing.seller.state,
        tier: listing.seller.tier,
        createdAt: listing.seller.createdAt.toISOString(),
        avgRating: sellerAvgRating,
        reviewCount: sellerReviews.length,
      },
      reviews: listing.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        buyer: {
          id: r.buyer.id,
          name: r.buyer.name,
          image: r.buyer.image,
        },
      })),
      reviewStats: {
        count: listing.reviews.length,
        avgRating: listingAvgRating,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] GET /api/listings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* PATCH /api/listings/[id]                                           */
/* Update listing (for seller)                                        */
/* ------------------------------------------------------------------ */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    /* Verify listing exists */
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 },
      );
    }

    /* Allowlist of updatable fields */
    const allowedFields = [
      "title",
      "description",
      "originalPrice",
      "askingPrice",
      "city",
      "state",
      "membershipType",
      "duration",
      "expiryDate",
      "images",
      "status",
    ] as const;

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "expiryDate" && body[field]) {
          updateData[field] = new Date(body[field] as string);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            tier: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      originalPrice: updated.originalPrice,
      askingPrice: updated.askingPrice,
      city: updated.city,
      state: updated.state,
      membershipType: updated.membershipType,
      duration: updated.duration,
      expiryDate: updated.expiryDate?.toISOString() ?? null,
      images: updated.images,
      status: updated.status,
      featured: updated.featured,
      views: updated.views,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      category: updated.category,
      seller: updated.seller,
    });
  } catch (error) {
    console.error("[API] PATCH /api/listings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 },
    );
  }
}
