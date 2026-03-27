import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FeaturedMarquee from "./featured-marquee";

async function getFeaturedListings() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE", featured: true },
      include: {
        seller: {
          select: {
            name: true,
            tier: true,
            image: true,
            reviewsReceived: { select: { rating: true } },
          },
        },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return listings;
  } catch {
    return [];
  }
}

export default async function FeaturedListings() {
  const listings = await getFeaturedListings();

  const listingsData = listings.map((listing) => {
    const reviews = listing.seller.reviewsReceived;
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return {
      id: listing.id,
      title: listing.title,
      askingPrice: listing.askingPrice,
      originalPrice: listing.originalPrice,
      city: listing.city,
      state: listing.state,
      images: listing.images,
      category: { name: listing.category.name },
      seller: {
        tier: listing.seller.tier,
        name: listing.seller.name,
        _avg: { rating: avgRating },
        _count: { reviews: reviews.length },
      },
    };
  });

  return (
    <section className="py-24 sm:py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Left-aligned heading — not centered SectionHeading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500 mb-3">
              Featured
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Hand-picked memberships
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group shrink-0"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {listingsData.length > 0 ? (
          <FeaturedMarquee listings={listingsData} />
        ) : (
          <div className="text-center py-16 border border-neutral-800/40">
            <p className="text-neutral-500">
              Featured memberships are on the way. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
