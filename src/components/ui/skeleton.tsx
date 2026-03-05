import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-200",
        className,
      )}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
