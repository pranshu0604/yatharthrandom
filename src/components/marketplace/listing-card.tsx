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
      <article className="relative bg-transparent transition-transform duration-500 hover:-translate-y-1">
        
        {/* ---- Image Section ---- */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 rounded-lg mb-4">
          <Image
            src={heroImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />

          {/* Badges - Floating on Image */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.featured && (
               <span className="bg-white text-black text-[10px] font-bold px-2 py-1 tracking-widest uppercase">Featured</span>
            )}
             {discount > 0 && (
               <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase border border-white/20">-{discount}%</span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
             <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
               <span className="text-xs font-medium text-white tracking-wide">{listing.category.name}</span>
             </div>
          </div>
        </div>

        {/* ---- Content Section - Minimalist Typography ---- */}
        <div className="space-y-1">
          <div className="flex justify-between items-start">
             <h3 className="text-lg font-serif text-white group-hover:text-neutral-300 transition-colors line-clamp-1">
              {listing.title}
            </h3>
             <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-neutral-400 font-mono">
                  {formatCurrency(listing.askingPrice)}
                </span>
             </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-neutral-500 uppercase tracking-widest">
            <span>{listing.city}</span>
            <div className="flex items-center gap-2">
               {isVerified && <span className="text-secondary">Verified</span>}
               {reviewCount > 0 && (
                 <div className="flex items-center gap-1">
                   <Star className="h-3 w-3 fill-white text-white" />
                   <span className="text-white">{avgRating.toFixed(1)}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

ListingCard.displayName = "ListingCard";

export { ListingCard };
