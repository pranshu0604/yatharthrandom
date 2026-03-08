"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { ListingCard, type ListingCardData } from "./listing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
interface ListingGridProps {
  listings: ListingCardData[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Empty state                                                        */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-20 w-20 rounded-2xl bg-neutral-800/80 flex items-center justify-center mb-6">
        <PackageSearch className="h-10 w-10 text-neutral-300" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">
        No memberships found
      </h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
        We couldn&apos;t find any listings matching your criteria. Try adjusting
        your filters or search to discover available memberships.
      </p>
      <Link href="/marketplace">
        <Button variant="primary" size="md">
          Browse All Listings
        </Button>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ListingGrid                                                        */
/* ------------------------------------------------------------------ */
function ListingGrid({ listings, className }: ListingGridProps) {
  if (listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6",
        className,
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {listings.map((listing) => (
        <motion.div key={listing.id} variants={itemVariants}>
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </motion.div>
  );
}

ListingGrid.displayName = "ListingGrid";

export { ListingGrid };
