"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
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
  seller: { tier: string };
}

export interface FeaturedMarqueeProps {
  listings: ListingMiniCardData[];
}

/* ------------------------------------------------------------------ */
/* Tier dot colors                                                     */
/* ------------------------------------------------------------------ */
const tierDotColors: Record<string, string> = {
  GOLD: "bg-secondary",
  SILVER: "bg-neutral-400",
  BRONZE: "bg-amber-700",
};

/* ------------------------------------------------------------------ */
/* Mini card (light theme)                                             */
/* ------------------------------------------------------------------ */
export function ListingMiniCard({ listing }: { listing: ListingMiniCardData }) {
  const discount = getDiscount(listing.originalPrice, listing.askingPrice);
  const image = listing.images?.[0];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block w-[320px] shrink-0 group"
    >
      <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-neutral-300">
        {/* Image */}
        <div className="relative h-[180px] bg-neutral-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="320px"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-100">
              <span className="text-sm font-medium text-neutral-400">
                {listing.category.name}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}

          {/* Category badge */}
          <span className="absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-neutral-700">
            {listing.category.name}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-800 line-clamp-1 text-sm group-hover:text-neutral-900">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
            <MapPin className="h-3 w-3" />
            <span>
              {listing.city}, {listing.state}
            </span>
          </div>

          {/* Price row */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 line-through">
                {formatCurrency(listing.originalPrice)}
              </span>
              <p className="text-base font-bold text-neutral-900 leading-tight">
                {formatCurrency(listing.askingPrice)}
              </p>
            </div>

            {/* Seller tier */}
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${tierDotColors[listing.seller.tier] ?? "bg-neutral-300"}`}
              />
              <span className="text-[10px] font-medium text-neutral-400 uppercase">
                {listing.seller.tier}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Featured grid (replaces marquee)                                    */
/* ------------------------------------------------------------------ */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function FeaturedMarquee({ listings }: FeaturedMarqueeProps) {
  if (listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {listings.slice(0, 8).map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease }}
        >
          <ListingMiniCard listing={listing} />
        </motion.div>
      ))}
    </div>
  );
}
