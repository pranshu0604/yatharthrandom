import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { listingSchema } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

/* ------------------------------------------------------------------ */
/* GET /api/listings                                                  */
/* ------------------------------------------------------------------ */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
    const category = searchParams.get("category") ?? "";
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const city = searchParams.get("city") ?? "";
    const tier = searchParams.get("tier") ?? "";
    const duration = searchParams.get("duration") ?? "";
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)),
    );

    /* Build where clause */
    const where: Prisma.ListingWhereInput = {
      status: "ACTIVE",
    };

    /* Text search */
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    /* Category filter */
    if (category) {
      const slugs = category.split(",").filter(Boolean);
      if (slugs.length > 0) {
        where.category = { slug: { in: slugs } };
      }
    }

    /* Price range */
    if (minPrice || maxPrice) {
      where.askingPrice = {};
      if (minPrice) where.askingPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.askingPrice.lte = parseFloat(maxPrice);
    }

    /* City */
    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    /* Seller tier */
    if (tier) {
      const tiers = tier.split(",").filter(Boolean);
      if (tiers.length > 0) {
        where.seller = {
          tier: { in: tiers as ("BRONZE" | "SILVER" | "GOLD")[] },
        };
      }
    }

    /* Duration filter */
    if (duration) {
      const durations = duration.split(",").filter(Boolean);
      if (durations.length > 0) {
        where.duration = { in: durations };
      }
    }

    /* Sort order */
    let orderBy: Prisma.ListingOrderByWithRelationInput;
    switch (sort) {
      case "price_asc":
        orderBy = { askingPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { askingPrice: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    /* Execute queries */
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: [{ featured: "desc" }, orderBy],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          seller: {
            select: {
              name: true,
              tier: true,
              image: true,
              reviewsReceived: {
                select: { rating: true },
              },
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    /* Transform seller reviews into avg/count */
    const transformed = listings.map((listing) => {
      const reviews = listing.seller.reviewsReceived;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      return {
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
        featured: listing.featured,
        views: listing.views,
        createdAt: listing.createdAt.toISOString(),
        category: listing.category,
        seller: {
          name: listing.seller.name,
          tier: listing.seller.tier,
          image: listing.seller.image,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      listings: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/listings                                                  */
/* Create a new listing (seller-only)                                  */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
  try {
    /* Authenticate */
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Only sellers can create listings" },
        { status: 403 },
      );
    }

    /* Parse and validate body */
    const body = await request.json();
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const userId = session.user.id;
    const userTier = session.user.tier as "BRONZE" | "SILVER" | "GOLD";

    /* Check listing limit based on tier */
    const [currentCount, tierConfig] = await Promise.all([
      prisma.listing.count({
        where: {
          sellerId: userId,
          status: { in: ["ACTIVE", "PENDING"] },
        },
      }),
      prisma.tierConfig.findUnique({
        where: { tier: userTier },
      }),
    ]);

    const maxListings = tierConfig?.maxListings ?? 5;

    if (currentCount >= maxListings) {
      return NextResponse.json(
        {
          error: `Listing limit reached. Your ${userTier.toLowerCase()} tier allows ${maxListings} active listings. Upgrade your tier for more.`,
        },
        { status: 403 },
      );
    }

    /* Verify category exists */
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }

    /* Create listing */
    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        originalPrice: data.originalPrice,
        askingPrice: data.askingPrice,
        city: data.city,
        state: data.state,
        membershipType: data.membershipType,
        duration: data.duration ?? null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        images: data.images ?? [],
        status: "PENDING",
        categoryId: data.categoryId,
        sellerId: userId,
      },
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

    return NextResponse.json(
      {
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
        views: listing.views,
        createdAt: listing.createdAt.toISOString(),
        category: listing.category,
        seller: listing.seller,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API] POST /api/listings error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
