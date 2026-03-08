import Link from "next/link";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    image: string | null;
    tier: "BRONZE" | "SILVER" | "GOLD";
    city: string | null;
    state: string | null;
    createdAt: string;
    avgRating: number;
    reviewCount: number;
  };
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tier config                                                        */
/* ------------------------------------------------------------------ */
const tierConfig = {
  BRONZE: {
    label: "Bronze Seller",
    variant: "outline" as const,
    className: "border-amber-700/30 text-amber-700 bg-amber-700/5",
  },
  SILVER: {
    label: "Silver Seller",
    variant: "outline" as const,
    className: "border-neutral-400/40 text-neutral-500 bg-neutral-400/5",
  },
  GOLD: {
    label: "Gold Seller",
    variant: "secondary" as const,
    className: "",
  },
} as const;

/* ------------------------------------------------------------------ */
/* SellerCard                                                         */
/* ------------------------------------------------------------------ */
function SellerCard({ seller, className }: SellerCardProps) {
  const tier = tierConfig[seller.tier];

  return (
    <Card className={cn("border-neutral-800/80", className)}>
      <CardContent className="space-y-4">
        {/* Seller profile row */}
        <div className="flex items-center gap-3.5">
          <Avatar
            name={seller.name}
            src={seller.image}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-neutral-100 truncate">
              {seller.name}
            </h3>
            <Badge
              variant={tier.variant}
              className={cn("mt-1", tier.className)}
            >
              {tier.label}
            </Badge>
          </div>
        </div>

        {/* Rating */}
        {seller.reviewCount > 0 ? (
          <div className="flex items-center gap-2.5">
            <StarRating
              value={seller.avgRating}
              halfStars
              starClassName="h-4 w-4"
            />
            <span className="text-sm font-semibold text-neutral-300">
              {seller.avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-400">
              ({seller.reviewCount} review{seller.reviewCount === 1 ? "" : "s"})
            </span>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No reviews yet</p>
        )}

        {/* Divider */}
        <div className="h-px bg-neutral-800/80" />

        {/* Details */}
        <div className="space-y-2.5">
          {(seller.city || seller.state) && (
            <div className="flex items-center gap-2.5 text-neutral-500">
              <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
              <span className="text-sm">
                {[seller.city, seller.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-neutral-500">
            <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
            <span className="text-sm">
              Member since {formatDate(seller.createdAt)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-800/80" />

        {/* Actions */}
        <div className="space-y-2.5">
          <Button variant="accent" size="md" className="w-full">
            Contact Seller
          </Button>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link
              href={`/seller/${seller.id}`}
              className="inline-flex items-center justify-center gap-1.5 text-sm"
            >
              View Profile
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

SellerCard.displayName = "SellerCard";

export { SellerCard };
