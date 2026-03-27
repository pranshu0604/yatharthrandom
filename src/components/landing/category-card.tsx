"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Building2,
  Palmtree,
  Plane,
  Trophy,
  Waves,
  GraduationCap,
  Heart,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Dumbbell,
  Building2,
  Palmtree,
  Plane,
  Trophy,
  Waves,
  GraduationCap,
  Heart,
  LayoutGrid,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string | null;
  listingCount: number;
  index: number;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/* Category card — left-aligned, no icon-in-circle, border-left accent */
/* ------------------------------------------------------------------ */
export default function CategoryCard({
  name,
  slug,
  icon,
  listingCount,
  index,
}: CategoryCardProps) {
  const Icon = useMemo(() => {
    if (!icon) return LayoutGrid;
    return iconMap[icon] ?? LayoutGrid;
  }, [icon]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease }}
    >
      <Link href={`/marketplace?category=${slug}`} className="group block">
        <div className="relative border-l-2 border-neutral-800 bg-neutral-900/40 px-5 py-5 sm:px-6 sm:py-6 transition-all duration-300 group-hover:border-accent group-hover:bg-neutral-900/80">
          {/* Icon + Name row */}
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-neutral-600 transition-colors duration-300 group-hover:text-accent shrink-0" />
            <h3 className="font-medium text-[15px] text-neutral-300 transition-colors duration-300 group-hover:text-white">
              {name}
            </h3>
          </div>

          {/* Count */}
          <p className="mt-2 text-xs text-neutral-600 pl-8">
            {listingCount} {listingCount === 1 ? "listing" : "listings"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
