"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

/* ------------------------------------------------------------------ */
/* SearchBar                                                          */
/* ------------------------------------------------------------------ */
function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") ?? "";
  const [value, setValue] = useState(initialQuery);
  const debouncedValue = useDebounce(value, 350);

  /* Sync debounced value to URL params */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set("query", debouncedValue);
    } else {
      params.delete("query");
    }

    // Reset to page 1 on new search
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedValue, pathname, router, searchParams]);

  const handleClear = useCallback(() => {
    setValue("");
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        {/* Search icon */}
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 pointer-events-none">
          <Search className="h-5 w-5" />
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search memberships... e.g. 'gym', 'country club', 'resort'"
          className={cn(
            "w-full rounded-xl border border-neutral-200 bg-white",
            "pl-12 pr-12 py-3.5 text-sm text-neutral-800",
            "placeholder:text-neutral-400",
            "shadow-sm",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
            "focus:shadow-[0_0_0_4px_rgba(46,196,182,0.08)]",
          )}
          aria-label="Search marketplace listings"
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

SearchBar.displayName = "SearchBar";

export { SearchBar };
