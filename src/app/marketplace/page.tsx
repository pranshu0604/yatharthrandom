import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { SearchBar } from "@/components/marketplace/search-bar";
import { FilterDrawer } from "@/components/marketplace/filter-drawer";
import { SortSelect } from "@/components/marketplace/sort-select";
import { ListingGrid } from "@/components/marketplace/listing-grid";
import type { ListingCardData } from "@/components/marketplace/listing-card";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------------------------------------------------ */
/* Metadata                                                           */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "Marketplace — ReMemberX",
  description:
    "Browse premium memberships at discounted prices. Find gym, club, resort and holiday memberships from verified sellers.",
};

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  city?: string;
  tier?: string;
  duration?: string;
  sort?: string;
  page?: string;
}

const PAGE_SIZE = 12;

/* ------------------------------------------------------------------ */
/* Data fetching                                                      */
/* ------------------------------------------------------------------ */
async function getListings(params: SearchParams) {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    city,
    tier,
    duration,
    sort = "newest",
    page = "1",
  } = params;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  /* Build Prisma where clause */
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

  /* Category filter (comma-separated slugs) */
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

  /* Seller tier (comma-separated) */
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

  /* Query */
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [{ featured: "desc" }, orderBy],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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

  /* Transform seller reviews into avg/count for the card */
  const transformed: ListingCardData[] = listings.map((listing) => {
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
      category: listing.category,
      seller: {
        name: listing.seller.name,
        tier: listing.seller.tier,
        image: listing.seller.image,
        _avg: { rating: avgRating },
        _count: { reviews: reviews.length },
      },
    };
  });

  return {
    listings: transformed,
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

async function getFilterData() {
  const [categories, citiesRaw] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
  ]);

  const cities = citiesRaw.map((c) => c.city);

  return { categories, cities };
}

/* ------------------------------------------------------------------ */
/* Loading skeleton                                                   */
/* ------------------------------------------------------------------ */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-100 bg-white overflow-hidden"
        >
          <Skeleton className="aspect-4/3 rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-7 w-1/3" />
            <div className="h-px bg-neutral-100" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default async function MarketplacePage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const [{ listings, total, page, totalPages }, { categories, cities }] =
    await Promise.all([getListings(searchParams), getFilterData()]);

  const hasMore = page < totalPages;

  /* Build "Load More" URL */
  const loadMoreParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") loadMoreParams.set(key, value);
  }
  loadMoreParams.set("page", String(page + 1));
  const loadMoreHref = `/marketplace?${loadMoreParams.toString()}`;

  return (
    <section className="w-full">
      {/* ---- Header ---- */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Marketplace
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 leading-relaxed">
              Discover premium memberships at unbeatable prices from verified
              sellers across India.
            </p>
          </div>
        </div>
      </div>

      {/* ---- Search + Sort Bar ---- */}
      <div className="sticky top-18 z-30 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Suspense fallback={<Skeleton className="h-12 flex-1 rounded-xl" />}>
              <SearchBar className="flex-1" />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-9 w-32 rounded-lg" />}>
              <SortSelect />
            </Suspense>
            {/* Mobile filter button */}
            <Suspense fallback={null}>
              <FilterDrawer categories={categories} cities={cities} className="lg:hidden" />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Results count */}
        <p className="text-sm text-neutral-500 mb-5">
          <span className="font-semibold text-neutral-700">{total}</span>{" "}
          {total === 1 ? "membership" : "memberships"} found
        </p>

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <Suspense fallback={null}>
            <FilterDrawer categories={categories} cities={cities} />
          </Suspense>

          {/* Listing grid */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<GridSkeleton />}>
              <ListingGrid listings={listings} />
            </Suspense>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <a href={loadMoreHref}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white px-7 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    Load More Listings
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
