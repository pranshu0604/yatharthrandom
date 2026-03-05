"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

type AvatarSize = keyof typeof sizeMap;

export interface AvatarProps {
  /** Full name used to derive initials fallback */
  name: string;
  /** Image URL — when absent or broken, initials are shown */
  src?: string | null;
  size?: AvatarSize;
  className?: string;
  alt?: string;
}

function Avatar({
  name,
  src,
  size = "md",
  className,
  alt,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-primary text-white font-semibold select-none overflow-hidden",
        sizeMap[size],
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt ?? name}
          fill
          onError={() => setImgError(true)}
          className="object-cover"
          sizes="(max-width: 768px) 40px, 56px"
          unoptimized
        />
      ) : (
        <span aria-label={name}>{getInitials(name)}</span>
      )}
    </span>
  );
}

Avatar.displayName = "Avatar";

export { Avatar, type AvatarSize };
