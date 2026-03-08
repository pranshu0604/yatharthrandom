import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-white/40",
  secondary:
    "bg-secondary text-black hover:brightness-110 focus-visible:ring-secondary/40",
  accent:
    "bg-accent text-white hover:brightness-110 focus-visible:ring-accent/40",
  outline:
    "border border-neutral-700 text-neutral-300 bg-transparent hover:bg-white/5 hover:text-white focus-visible:ring-neutral-500/40",
  ghost:
    "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 focus-visible:ring-neutral-700",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      "inline-flex items-center justify-center font-medium rounded-lg",
      "transition-all duration-200 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-neutral-950",
      "disabled:opacity-50 disabled:pointer-events-none",
      "active:scale-[0.98]",
      variants[variant],
      sizes[size],
      className,
    );

    if (asChild) {
      return (
        <span className={cn(classes, "contents")} data-slot="button">
          {children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonVariant, type ButtonSize };
