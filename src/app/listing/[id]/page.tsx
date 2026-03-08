import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ChevronRight,
  Eye,
  MapPin,
  Clock,
  Tag,
  Share2,
  Heart,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageGallery } from "@/components/listing/image-gallery";
import { PriceBreakdown } from "@/components/listing/price-breakdown";
import { SellerCard } from "@/components/listing/seller-card";
import { ReviewSection, type ReviewData } from "@/components/listing/review-section";
import { RelatedListings } from "@/components/listing/related-listings";

/* ------------------------------------------------------------------ */
/* Data fetching                                                      */
/* ------------------------------------------------------------------ */
async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        include: {
          reviewsReceived: {
            select: { rating: true },
          },
        },
      },
      reviews: {
        include: {
          buyer: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing) return null;

  /* Increment view count (fire-and-forget) */
  prisma.listing
    .update({
      where: { id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {
      /* silent fail — view count is not critical */
    });

  return listing;
}

/* ------------------------------------------------------------------ */
/* Metadata                                                           */
/* ------------------------------------------------------------------ */
type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      images: true,
      askingPrice: true,
      category: { select: { name: true } },
    },
  });

  if (!listing) {
    return {
      title: "Listing Not Found — ReMemberX",
    };
  }

  const ogImage = listing.images[0] ?? "/og-default.jpg";

  return {
    title: `${listing.title} — ReMemberX`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.title} | ${formatCurrency(listing.askingPrice)}`,
      description: listing.description.slice(0, 160),
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                         */
/* ------------------------------------------------------------------ */
function Breadcrumb({
  categoryName,
  categorySlug,
  listingTitle,
}: {
  categoryName: string;
  categorySlug: string;
  listingTitle: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-neutral-400 overflow-x-auto"
    >
      <Link
        href="/"
        className="shrink-0 hover:text-white transition-colors"
      >
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <Link
        href="/marketplace"
        className="shrink-0 hover:text-white transition-colors"
      >
        Marketplace
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <Link
        href={`/marketplace?category=${categorySlug}`}
        className="shrink-0 hover:text-white transition-colors"
      >
        {categoryName}
      </Link>
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="text-neutral-400 font-medium truncate">
        {listingTitle}
      </span>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  /* Compute seller stats */
  const sellerReviews = listing.seller.reviewsReceived;
  const sellerAvgRating =
    sellerReviews.length > 0
      ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) /
        sellerReviews.length
      : 0;

  /* Listing reviews for the review section */
  const reviewsData: ReviewData[] = listing.reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    buyer: {
      name: r.buyer.name,
      image: r.buyer.image,
    },
  }));

  const listingAvgRating =
    reviewsData.length > 0
      ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
      : 0;

  const discount = getDiscount(listing.originalPrice, listing.askingPrice);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* ---- Header bar with breadcrumb ---- */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            categoryName={listing.category.name}
            categorySlug={listing.category.slug}
            listingTitle={listing.title}
          />
        </div>
      </div>

      {/* ---- Main content ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* ============================================================ */}
          {/* LEFT COLUMN (2/3)                                            */}
          {/* ============================================================ */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Image Gallery */}
            <ScrollReveal direction="up" duration={0.4}>
              <ImageGallery images={listing.images} title={listing.title} />
            </ScrollReveal>

            {/* Title and meta */}
            <ScrollReveal direction="up" delay={0.1} duration={0.4}>
              <div className="space-y-4">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      {listing.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {listing.category.name}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm">
                          {listing.city}, {listing.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-sm">
                          {listing.views.toLocaleString()} views
                        </span>
                      </div>
                      {listing.duration && (
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-sm">{listing.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action icons — right side */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                      aria-label="Save listing"
                    >
                      <Heart className="h-4.5 w-4.5" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                      aria-label="Share listing"
                    >
                      <Share2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Price row on mobile (visible below lg) */}
                <div className="lg:hidden flex items-baseline gap-3 pt-1">
                  <span className="text-2xl font-bold text-white">
                    {formatCurrency(listing.askingPrice)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-base text-neutral-400 line-through">
                        {formatCurrency(listing.originalPrice)}
                      </span>
                      <span className="text-sm font-bold text-accent">
                        {discount}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Divider */}
            <div className="h-px bg-neutral-700/60" />

            {/* Description */}
            <ScrollReveal direction="up" delay={0.15} duration={0.4}>
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">
                  About this Membership
                </h2>
                <div className="prose prose-invert prose-sm max-w-none text-neutral-400 leading-relaxed">
                  {listing.description.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Membership details grid */}
            <ScrollReveal direction="up" delay={0.2} duration={0.4}>
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">
                  Membership Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow label="Type" value={listing.membershipType} />
                  <DetailRow label="Category" value={listing.category.name} />
                  <DetailRow
                    label="Location"
                    value={`${listing.city}, ${listing.state}`}
                  />
                  {listing.duration && (
                    <DetailRow label="Duration" value={listing.duration} />
                  )}
                  {listing.expiryDate && (
                    <DetailRow
                      label="Expires"
                      value={formatDate(listing.expiryDate)}
                    />
                  )}
                  <DetailRow
                    label="Listed"
                    value={formatDate(listing.createdAt)}
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Divider */}
            <div className="h-px bg-neutral-700/60" />

            {/* Reviews Section */}
            <ScrollReveal direction="up" delay={0.1} duration={0.4}>
              <ReviewSection
                reviews={reviewsData}
                averageRating={listingAvgRating}
              />
            </ScrollReveal>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (1/3) — Sticky sidebar                          */}
          {/* ============================================================ */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-[92px] space-y-5">
              <ScrollReveal direction="right" duration={0.4}>
                <PriceBreakdown
                  originalPrice={listing.originalPrice}
                  askingPrice={listing.askingPrice}
                  expiryDate={listing.expiryDate?.toISOString() ?? null}
                  duration={listing.duration}
                  membershipType={listing.membershipType}
                />
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1} duration={0.4}>
                <SellerCard
                  seller={{
                    id: listing.seller.id,
                    name: listing.seller.name,
                    image: listing.seller.image,
                    tier: listing.seller.tier,
                    city: listing.seller.city,
                    state: listing.seller.state,
                    createdAt: listing.seller.createdAt.toISOString(),
                    avgRating:
                      Math.round(sellerAvgRating * 10) / 10,
                    reviewCount: sellerReviews.length,
                  }}
                />
              </ScrollReveal>
            </div>
          </aside>
        </div>

        {/* ---- Related Listings ---- */}
        <div className="mt-16">
          <ScrollReveal direction="up" duration={0.4}>
            <div className="h-px bg-neutral-700/60 mb-10" />
            <Suspense fallback={null}>
              <RelatedListings
                categoryId={listing.categoryId}
                categoryName={listing.category.name}
                categorySlug={listing.category.slug}
                currentListingId={listing.id}
              />
            </Suspense>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail row helper                                                  */
/* ------------------------------------------------------------------ */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3.5">
      <span className="text-sm text-neutral-400 shrink-0 w-20">{label}</span>
      <span className="text-sm font-medium text-neutral-300">{value}</span>
    </div>
  );
}
