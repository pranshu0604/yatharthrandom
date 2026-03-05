"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label rendered above the input */
  label?: string;
  /** Error message rendered below the input */
  error?: string;
  /** Icon element rendered inside the input on the left */
  leftIcon?: ReactNode;
  /** Additional wrapper className */
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      className,
      wrapperClassName,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? props.name;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-neutral-800",
              "placeholder:text-neutral-400",
              "transition-shadow duration-200",
              "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50",
              error
                ? "border-error focus:ring-error/40 focus:border-error"
                : "border-neutral-300",
              leftIcon && "pl-10",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
