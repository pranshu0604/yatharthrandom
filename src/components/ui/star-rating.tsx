"use client";

import { useState, useCallback, useId, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Star SVG                                                            */
/* ------------------------------------------------------------------ */
function StarIcon({
  fill = 0,
  gradientId,
  className,
}: {
  /** 0 = empty, 0.5 = half, 1 = full */
  fill: number;
  gradientId: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop
            offset={`${fill * 100}%`}
            stopColor="var(--color-secondary)"
          />
          <stop
            offset={`${fill * 100}%`}
            stopColor="transparent"
          />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${gradientId})`}
        stroke="var(--color-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* StarRating                                                         */
/* ------------------------------------------------------------------ */
export interface StarRatingProps {
  /** Current value (0 - 5). Supports half values for display mode. */
  value: number;
  /** Number of stars (default 5) */
  max?: number;
  /** Callback when value changes — omit to make display-only */
  onChange?: (value: number) => void;
  /** Show half-star granularity in display mode */
  halfStars?: boolean;
  /** Size class applied to each star */
  starClassName?: string;
  className?: string;
}

function StarRating({
  value,
  max = 5,
  onChange,
  halfStars = false,
  starClassName,
  className,
}: StarRatingProps) {
  const baseId = useId();
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = typeof onChange === "function";
  const displayValue = hovered ?? value;

  const getFill = useCallback(
    (index: number): number => {
      const starNumber = index + 1;
      if (displayValue >= starNumber) return 1;
      if (halfStars && displayValue >= starNumber - 0.5) return 0.5;
      return 0;
    },
    [displayValue, halfStars],
  );

  const handleClick = (index: number) => {
    if (!interactive) return;
    onChange(index + 1);
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(index + 1);
    }
  };

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          role={interactive ? "radio" : undefined}
          aria-checked={interactive ? i + 1 <= value : undefined}
          aria-label={interactive ? `${i + 1} star${i === 0 ? "" : "s"}` : undefined}
          tabIndex={interactive ? 0 : undefined}
          className={cn(
            interactive &&
              "cursor-pointer transition-transform hover:scale-110",
          )}
          onClick={() => handleClick(i)}
          onMouseEnter={() => interactive && setHovered(i + 1)}
          onMouseLeave={() => interactive && setHovered(null)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          <StarIcon fill={getFill(i)} gradientId={`${baseId}-star-${i}`} className={starClassName} />
        </span>
      ))}
    </div>
  );
}

StarRating.displayName = "StarRating";

export { StarRating };
