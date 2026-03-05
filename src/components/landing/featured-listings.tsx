import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SectionHeading from "./section-heading";
import FeaturedMarquee from "./featured-marquee";

async function getFeaturedListings() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE", featured: true },
      include: {
        seller: { select: { name: true, tier: true, image: true } },
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

  const listingsData = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    askingPrice: listing.askingPrice,
    originalPrice: listing.originalPrice,
    city: listing.city,
    state: listing.state,
    images: listing.images,
    category: { name: listing.category.name },
    seller: { tier: listing.seller.tier },
  }));

  return (
    <section className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Memberships"
          subtitle="Hand-picked deals with verified sellers and the best discounts"
          className="mb-14"
        />

        {listingsData.length > 0 ? (
          <FeaturedMarquee listings={listingsData} />
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-lg">
              Featured memberships are on the way. Check back soon!
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold hover:underline group"
          >
            View All Listings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
