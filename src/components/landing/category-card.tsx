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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <Link href={`/marketplace?category=${slug}`} className="group block">
        <div className="relative rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-neutral-600">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-xl bg-white/8 text-neutral-400 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            <Icon className="h-7 w-7" />
          </div>

          {/* Name */}
          <h3 className="mt-4 font-semibold text-neutral-100 transition-colors duration-300 group-hover:text-white">
            {name}
          </h3>

          {/* Count */}
          <p className="mt-1 text-sm text-neutral-400">
            {listingCount} {listingCount === 1 ? "listing" : "listings"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
