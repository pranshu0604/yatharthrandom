import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { cn, formatCurrency, getDiscount } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface RelatedListingsProps {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  currentListingId: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Mini listing card                                                  */
/* ------------------------------------------------------------------ */
interface MiniListing {
  id: string;
  title: string;
  askingPrice: number;
  originalPrice: number;
  images: string[];
  city: string;
  state: string;
  membershipType: string;
  seller: {
    name: string;
    tier: "BRONZE" | "SILVER" | "GOLD";
  };
}

function MiniListingCard({ listing }: { listing: MiniListing }) {
  const discount = getDiscount(listing.originalPrice, listing.askingPrice);
  const heroImage = listing.images[0] ?? "/placeholder-listing.jpg";

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-none hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={heroImage}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-white shadow-none">
              {discount}% off
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h4 className="text-sm font-semibold text-neutral-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-white transition-colors">
          {listing.title}
        </h4>
        <div className="flex items-center gap-1 text-neutral-400 mb-2">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="text-xs truncate">
            {listing.city}, {listing.state}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-white tracking-tight">
            {formatCurrency(listing.askingPrice)}
          </span>
          {listing.originalPrice > listing.askingPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatCurrency(listing.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* RelatedListings (server component)                                  */
/* ------------------------------------------------------------------ */
async function RelatedListings({
  categoryId,
  categoryName,
  categorySlug,
  currentListingId,
  className,
}: RelatedListingsProps) {
  const listings = await prisma.listing.findMany({
    where: {
      categoryId,
      status: "ACTIVE",
      id: { not: currentListingId },
    },
    take: 4,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      askingPrice: true,
      originalPrice: true,
      images: true,
      city: true,
      state: true,
      membershipType: true,
      seller: {
        select: {
          name: true,
          tier: true,
        },
      },
    },
  });

  if (listings.length === 0) return null;

  return (
    <section className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">
          More in {categoryName}
        </h2>
        <Link
          href={`/marketplace?category=${categorySlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <MiniListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

RelatedListings.displayName = "RelatedListings";

export { RelatedListings };
