import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-neutral-900",
  error: "bg-error text-white",
  outline: "border border-neutral-300 text-neutral-700 bg-transparent",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-medium leading-tight whitespace-nowrap",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export { Badge, type BadgeVariant };
