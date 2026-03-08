"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ListingMiniCard, type ListingMiniCardData } from "./featured-marquee";

interface FeaturedCarouselProps {
  listings: ListingMiniCardData[];
}

export default function FeaturedCarousel({ listings }: FeaturedCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraintRight, setDragConstraintRight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = 320;
  const gap = 24;

  useEffect(() => {
    function calculateConstraints() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = listings.length * cardWidth + (listings.length - 1) * gap;
      const overflow = contentWidth - containerWidth;
      setDragConstraintRight(overflow > 0 ? -overflow : 0);
    }

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [listings.length]);

  function handleDrag(_: unknown, info: { offset: { x: number } }) {
    const dragOffset = -info.offset.x;
    const index = Math.round(dragOffset / (cardWidth + gap));
    const clampedIndex = Math.max(0, Math.min(index, listings.length - 1));
    setActiveIndex(clampedIndex);
  }

  if (listings.length === 0) return null;

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: dragConstraintRight,
            right: 0,
          }}
          dragElastic={0.1}
          dragTransition={{
            bounceStiffness: 300,
            bounceDamping: 30,
          }}
          onDrag={handleDrag}
        >
          {listings.map((listing) => (
            <ListingMiniCard key={listing.id} listing={listing} />
          ))}
        </motion.div>
      </div>

      {listings.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {listings.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-neutral-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
