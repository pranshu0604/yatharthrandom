"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Eye, Star, Heart, ShieldCheck } from "lucide-react";
import { cn, formatCurrency, getDiscount, getDaysUntilExpiry } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export interface ListingCardData {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  askingPrice: number;
  city: string;
  state: string;
  membershipType: string;
  duration: string | null;
  expiryDate: string | null;
  images: string[];
  featured: boolean;
  views: number;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    name: string;
    tier: "BRONZE" | "SILVER" | "GOLD";
    image: string | null;
    _avg?: { rating: number | null };
    _count?: { reviews: number };
  };
}

interface ListingCardProps {
  listing: ListingCardData;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tier config                                                        */
/* ------------------------------------------------------------------ */
const tierConfig = {
  BRONZE: {
    label: "Bronze",
    bg: "bg-amber-700/10",
    text: "text-amber-700",
    border: "border-amber-700/20",
  },
  SILVER: {
    label: "Silver",
    bg: "bg-neutral-400/10",
    text: "text-neutral-500",
    border: "border-neutral-400/20",
  },
  GOLD: {
    label: "Gold",
    bg: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/20",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
function ListingCard({ listing, className }: ListingCardProps) {
  const discount = getDiscount(listing.originalPrice, listing.askingPrice);
  const daysLeft = getDaysUntilExpiry(listing.expiryDate);
  const tier = tierConfig[listing.seller.tier];
  const avgRating = listing.seller._avg?.rating ?? 0;
  const reviewCount = listing.seller._count?.reviews ?? 0;
  const heroImage = listing.images[0] ?? "/placeholder-listing.jpg";
  const isVerified = listing.seller.tier === "GOLD" || listing.seller.tier === "SILVER";

  return (
    <Link href={`/listing/${listing.id}`} className={cn("block group", className)}>
      <article
        className={cn(
          "relative rounded-2xl bg-white overflow-hidden",
          "border border-neutral-100",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]",
          "transition-all duration-300 ease-out",
          "hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(0,0,0,0.06)]",
          "hover:-translate-y-1",
          listing.featured &&
            "ring-1 ring-secondary/30 shadow-[0_2px_8px_rgba(201,169,110,0.12)]",
        )}
      >
        {/* ---- Image Section ---- */}
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={heroImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

          {/* Category badge — top left */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
              {listing.category.name}
            </span>
          </div>

          {/* Discount badge — top right */}
          {discount > 0 && (
            <div className="absolute top-3 right-12">
              <span className="inline-flex items-center rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                {discount}% off
              </span>
            </div>
          )}

          {/* Heart/save button — top right */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-neutral-500 transition-colors duration-200 hover:text-red-500 hover:bg-white">
              <Heart className="h-4 w-4" />
            </span>
          </div>

          {/* Featured badge */}
          {listing.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            </div>
          )}

          {/* Views — bottom right over image */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/40 backdrop-blur-sm px-2 py-0.5 text-[11px] font-medium text-white/90">
              <Eye className="h-3 w-3" />
              {listing.views}
            </span>
          </div>
        </div>

        {/* ---- Content Section ---- */}
        <div className="p-4 sm:p-5">
          {/* Title + Verified */}
          <div className="flex items-start gap-1.5">
            <h3 className="text-[15px] font-semibold text-neutral-800 leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200 flex-1">
              {listing.title}
            </h3>
            {isVerified && (
              <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-neutral-400 mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium truncate">
              {listing.city}, {listing.state}
            </span>
          </div>

          {/* Price + Rating row */}
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl font-bold text-primary tracking-tight">
                {formatCurrency(listing.askingPrice)}
              </span>
              {listing.originalPrice > listing.askingPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatCurrency(listing.originalPrice)}
                </span>
              )}
            </div>
            {/* Star rating */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <span className="text-sm font-semibold text-neutral-700">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-neutral-400">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-100 mb-3" />

          {/* Seller info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {/* Seller avatar placeholder */}
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">
                  {listing.seller.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-700 truncate">
                  {listing.seller.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/* Tier badge */}
                  <span
                    className={cn(
                      "inline-flex items-center rounded px-1.5 py-px text-[10px] font-semibold border",
                      tier.bg,
                      tier.text,
                      tier.border,
                    )}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration / Expiry info */}
            {(listing.duration || daysLeft !== null) && (
              <div className="flex items-center gap-1 text-neutral-400 shrink-0 ml-2">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">
                  {daysLeft !== null && daysLeft > 0
                    ? `${daysLeft}d left`
                    : daysLeft !== null && daysLeft <= 0
                      ? "Expired"
                      : listing.duration}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

ListingCard.displayName = "ListingCard";

export { ListingCard };
