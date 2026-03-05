"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sort options                                                       */
/* ------------------------------------------------------------------ */
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

/* ------------------------------------------------------------------ */
/* SortSelect                                                         */
/* ------------------------------------------------------------------ */
function SortSelect({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = e.target.value;

      if (value === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }

      // Reset pagination
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 whitespace-nowrap">
        <ArrowUpDown className="h-3.5 w-3.5" />
        Sort by
      </span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={handleChange}
          className={cn(
            "appearance-none rounded-lg border border-neutral-200 bg-white",
            "pl-3 pr-8 py-2 text-sm font-medium text-neutral-700",
            "transition-all duration-200 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
            "hover:border-neutral-300",
          )}
          aria-label="Sort listings"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

SortSelect.displayName = "SortSelect";

export { SortSelect };
