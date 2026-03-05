"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export interface SavedListingCardProps {
  id: string;
  listingId: string;
  title: string;
  askingPrice: number;
  image: string | null;
  category: string;
  city: string;
  savedAt: string;
  onRemove?: (id: string) => void;
}

export function SavedListingCard({
  id,
  listingId,
  title,
  askingPrice,
  image,
  category,
  city,
  savedAt,
  onRemove,
}: SavedListingCardProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      onRemove?.(id);
    } catch {
      setRemoving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-neutral-100",
        "bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
      )}
    >
      {/* Thumbnail */}
      <Link
        href={`/listing/${listingId}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400 text-xs">
            No image
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/listing/${listingId}`}
          className="block text-sm font-semibold text-neutral-800 truncate hover:text-accent transition-colors"
        >
          {title}
        </Link>
        <p className="text-base font-bold text-primary mt-0.5">
          {formatCurrency(askingPrice)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-neutral-500">{category}</span>
          <span className="text-neutral-300">|</span>
          <span className="text-xs text-neutral-500">{city}</span>
        </div>
        <p className="text-xs text-neutral-400 mt-0.5">
          Saved {formatDate(savedAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <Link
          href={`/listing/${listingId}`}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-accent/10 hover:text-accent transition-colors"
          title="View listing"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-error/10 hover:text-error transition-colors disabled:opacity-50 cursor-pointer"
          title="Remove from saved"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
