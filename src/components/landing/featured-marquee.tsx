"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Heart, ShieldCheck, Star } from "lucide-react";
import { formatCurrency, getDiscount } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface ListingMiniCardData {
  id: string;
  title: string;
  askingPrice: number;
  originalPrice: number;
  city: string;
  state: string;
  images: string[];
  category: { name: string };
  seller: { tier: string; name?: string; _avg?: { rating: number | null }; _count?: { reviews: number } };
}

export interface FeaturedMarqueeProps {
  listings: ListingMiniCardData[];
}

/* ------------------------------------------------------------------ */
/* Tier accent                                                         */
/* ------------------------------------------------------------------ */
const tierColors: Record<string, string> = {
  GOLD: "text-secondary",
  SILVER: "text-neutral-400",
  BRONZE: "text-amber-600",
};

/* ------------------------------------------------------------------ */
/* Listing card — sharp, editorial, not template-y                     */
/*                                                                     */
/* Key anti-AI-slop decisions:                                         */
/*  - rounded-lg NOT rounded-xl/2xl (subtle, not pillowy)              */
/*  - No border on idle — just a subtle bg difference                  */
/*  - Discount badge is a sharp rectangle, not rounded-full            */
/*  - Category label uses uppercase mono, not a pill badge             */
/*  - Price is left-aligned large, not crammed into a flex row         */
/* ------------------------------------------------------------------ */
export function ListingMiniCard({ listing }: { listing: ListingMiniCardData }) {
  const discount = getDiscount(listing.originalPrice, listing.askingPrice);
  const image = listing.images?.[0];
  const isVerified = listing.seller.tier === "GOLD" || listing.seller.tier === "SILVER";
  const avgRating = listing.seller._avg?.rating ?? 0;
  const reviewCount = listing.seller._count?.reviews ?? 0;

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block w-full group"
    >
      <div className="overflow-hidden bg-neutral-900/50 transition-all duration-300 ease-out hover:bg-neutral-900 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-800">
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                {listing.category.name}
              </span>
            </div>
          )}

          {/* Gradient overlay — always visible, subtle */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Discount badge — sharp, not round */}
          {discount > 0 && (
            <span className="absolute top-0 left-0 bg-accent text-white text-[11px] font-bold px-3 py-1.5 tracking-wide">
              {discount}% OFF
            </span>
          )}

          {/* Heart */}
          <button className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-black/40 backdrop-blur-sm text-white/60 transition-colors duration-200 group-hover:text-red-400 rounded-full">
            <Heart className="h-3.5 w-3.5" />
          </button>

          {/* Bottom — price overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                {discount > 0 && (
                  <span className="text-[11px] text-white/50 line-through mr-2">
                    {formatCurrency(listing.originalPrice)}
                  </span>
                )}
                <p className="text-lg font-bold text-white leading-none">
                  {formatCurrency(listing.askingPrice)}
                </p>
              </div>
              {reviewCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/70">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  {avgRating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
              {listing.category.name}
            </span>
            {isVerified && (
              <ShieldCheck className="h-3 w-3 text-accent" />
            )}
          </div>

          <h3 className="font-medium text-neutral-200 line-clamp-1 text-[15px] leading-snug group-hover:text-white transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="h-3 w-3" />
              <span>{listing.city}</span>
            </div>

            <span className={`text-[10px] font-semibold uppercase tracking-wider ${tierColors[listing.seller.tier] ?? "text-neutral-500"}`}>
              {listing.seller.tier}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Featured grid                                                       */
/* ------------------------------------------------------------------ */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function FeaturedMarquee({ listings }: FeaturedMarqueeProps) {
  if (listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800/40">
      {listings.slice(0, 8).map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease }}
        >
          <ListingMiniCard listing={listing} />
        </motion.div>
      ))}
    </div>
  );
}
