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
          "relative rounded-xl bg-white overflow-hidden",
          "border border-neutral-100", // Subtle border
          "shadow-sm hover:shadow-xl hover:shadow-neutral-900/5", // Clean shadow lift
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1"
        )}
      >
        {/* ---- Image Section ---- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={heroImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Top Overlay Gradient (for text readability if needed) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating Badges - Cleanly Grouped */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
             {listing.featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-neutral-900 shadow-sm border border-neutral-200/50">
                <Star className="h-3 w-3 fill-neutral-900" />
                FEATURED
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-neutral-900/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              {listing.category.name}
            </span>
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
             <div className="absolute bottom-3 right-3">
               <span className="inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                 {discount}% OFF
               </span>
             </div>
          )}
          
          {/* Wishlist Button - Minimal */}
          <div className="absolute top-3 right-3">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white text-neutral-600 transition-all duration-200 hover:scale-110 active:scale-95">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ---- Content Section ---- */}
        <div className="p-4">
          
          {/* Header Row: Title & Price */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
               <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-1 group-hover:text-neutral-700 transition-colors">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1 text-neutral-500 mt-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="text-xs truncate max-w-[150px]">
                  {listing.city}, {listing.state}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
               <div className="text-[17px] font-bold text-neutral-900 tracking-tight">
                 {formatCurrency(listing.askingPrice)}
               </div>
               {listing.originalPrice > listing.askingPrice && (
                 <div className="text-[11px] text-neutral-400 line-through decoration-neutral-400/50">
                   {formatCurrency(listing.originalPrice)}
                 </div>
               )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-neutral-100 my-3" />

          {/* Footer Row: Seller & Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-[9px] font-bold text-neutral-600">
                {listing.seller.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-medium text-neutral-900 leading-none">
                   {listing.seller.name}
                 </span>
                 <div className="flex items-center gap-1 mt-0.5">
                    {isVerified && <ShieldCheck className="h-2.5 w-2.5 text-blue-500" />}
                    <span className="text-[10px] text-neutral-500">
                      {tier.label} Seller
                    </span>
                 </div>
              </div>
            </div>

            {/* Rating or New Label */}
            {reviewCount > 0 ? (
               <div className="flex items-center gap-1 rounded-full bg-neutral-50 px-1.5 py-0.5 border border-neutral-100">
                  <Star className="h-3 w-3 fill-neutral-900 text-neutral-900" />
                  <span className="text-[10px] font-bold text-neutral-900">{avgRating.toFixed(1)}</span>
               </div>
            ) : (
               <span className="text-[10px] font-medium text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">New</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

ListingCard.displayName = "ListingCard";

export { ListingCard };
