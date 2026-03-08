"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface CategoryOption {
  slug: string;
  name: string;
}

interface FilterDrawerProps {
  categories: CategoryOption[];
  cities: string[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tier options                                                       */
/* ------------------------------------------------------------------ */
const sellerTiers = [
  { value: "BRONZE", label: "Bronze" },
  { value: "SILVER", label: "Silver" },
  { value: "GOLD", label: "Gold" },
] as const;

const durationOptions = [
  { value: "Lifetime", label: "Lifetime" },
  { value: "Annual", label: "Annual" },
  { value: "Monthly", label: "Monthly" },
] as const;

/* ------------------------------------------------------------------ */
/* FilterSection — collapsible group                                  */
/* ------------------------------------------------------------------ */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 text-sm font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox item                                                      */
/* ------------------------------------------------------------------ */
function CheckboxItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-700 text-accent focus:ring-accent/40 cursor-pointer accent-accent"
      />
      <span className="text-sm text-neutral-400 group-hover:text-neutral-100 transition-colors">
        {label}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* FilterContent — shared between desktop and mobile                  */
/* ------------------------------------------------------------------ */
function FilterContent({
  categories,
  cities,
  selectedCategories,
  setSelectedCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedCity,
  setSelectedCity,
  selectedTiers,
  setSelectedTiers,
  selectedDurations,
  setSelectedDurations,
  onApply,
  onClear,
  hasActiveFilters,
}: {
  categories: CategoryOption[];
  cities: string[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  selectedCity: string;
  setSelectedCity: (v: string) => void;
  selectedTiers: string[];
  setSelectedTiers: (v: string[]) => void;
  selectedDurations: string[];
  setSelectedDurations: (v: string[]) => void;
  onApply: () => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  const toggleCategory = useCallback(
    (slug: string, checked: boolean) => {
      setSelectedCategories(
        checked
          ? [...selectedCategories, slug]
          : selectedCategories.filter((c) => c !== slug),
      );
    },
    [selectedCategories, setSelectedCategories],
  );

  const toggleTier = useCallback(
    (tier: string, checked: boolean) => {
      setSelectedTiers(
        checked
          ? [...selectedTiers, tier]
          : selectedTiers.filter((t) => t !== tier),
      );
    },
    [selectedTiers, setSelectedTiers],
  );

  const toggleDuration = useCallback(
    (dur: string, checked: boolean) => {
      setSelectedDurations(
        checked
          ? [...selectedDurations, dur]
          : selectedDurations.filter((d) => d !== dur),
      );
    },
    [selectedDurations, setSelectedDurations],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1">
        {/* Category filter */}
        {categories.length > 0 && (
          <FilterSection title="Category">
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <CheckboxItem
                  key={cat.slug}
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={(checked) => toggleCategory(cat.slug, checked)}
                  label={cat.name}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                min="0"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-7 pr-3 py-2 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <span className="text-neutral-300 text-xs font-medium">to</span>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 text-xs pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                min="0"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-7 pr-3 py-2 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
        </FilterSection>

        {/* Location */}
        {cities.length > 0 && (
          <FilterSection title="Location">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 pr-8 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </FilterSection>
        )}

        {/* Seller Tier */}
        <FilterSection title="Seller Tier">
          <div className="space-y-0.5">
            {sellerTiers.map((t) => (
              <CheckboxItem
                key={t.value}
                checked={selectedTiers.includes(t.value)}
                onChange={(checked) => toggleTier(t.value, checked)}
                label={t.label}
              />
            ))}
          </div>
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration">
          <div className="space-y-0.5">
            {durationOptions.map((d) => (
              <CheckboxItem
                key={d.value}
                checked={selectedDurations.includes(d.value)}
                onChange={(checked) => toggleDuration(d.value, checked)}
                label={d.label}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 pt-4 border-t border-neutral-800 space-y-2">
        <Button
          variant="primary"
          size="md"
          onClick={onApply}
          className="w-full"
        >
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="w-full text-neutral-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FilterDrawer (main export)                                         */
/* ------------------------------------------------------------------ */
function FilterDrawer({ categories, cities, className }: FilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Parse current URL params into local state */
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) ?? [],
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") ?? "",
  );
  const [selectedTiers, setSelectedTiers] = useState<string[]>(
    searchParams.get("tier")?.split(",").filter(Boolean) ?? [],
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    searchParams.get("duration")?.split(",").filter(Boolean) ?? [],
  );

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedCity !== "" ||
    selectedTiers.length > 0 ||
    selectedDurations.length > 0;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Category
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    // Price
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    // City
    if (selectedCity) params.set("city", selectedCity);
    else params.delete("city");

    // Tier
    if (selectedTiers.length > 0) {
      params.set("tier", selectedTiers.join(","));
    } else {
      params.delete("tier");
    }

    // Duration
    if (selectedDurations.length > 0) {
      params.set("duration", selectedDurations.join(","));
    } else {
      params.delete("duration");
    }

    // Reset pagination
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMobileOpen(false);
  }, [
    searchParams,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedCity,
    selectedTiers,
    selectedDurations,
    pathname,
    router,
  ]);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedCity("");
    setSelectedTiers([]);
    setSelectedDurations([]);

    const params = new URLSearchParams();
    const query = searchParams.get("query");
    const sort = searchParams.get("sort");
    if (query) params.set("query", query);
    if (sort) params.set("sort", sort);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMobileOpen(false);
  }, [pathname, router, searchParams]);

  const filterContent = (
    <FilterContent
      categories={categories}
      cities={cities}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
      selectedTiers={selectedTiers}
      setSelectedTiers={setSelectedTiers}
      selectedDurations={selectedDurations}
      setSelectedDurations={setSelectedDurations}
      onApply={applyFilters}
      onClear={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  const activeCount = [
    selectedCategories.length > 0,
    minPrice || maxPrice,
    selectedCity,
    selectedTiers.length > 0,
    selectedDurations.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      {/* ---- Desktop sidebar ---- */}
      <aside
        className={cn(
          "hidden lg:block w-72 shrink-0",
          className,
        )}
      >
        <div className="sticky top-[88px] rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-none">
          <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider mb-4">
            Filters
          </h2>
          {filterContent}
        </div>
      </aside>

      {/* ---- Mobile filter trigger ---- */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* ---- Mobile bottom drawer ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={backdropRef}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl bg-neutral-900 shadow-2xl lg:hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-neutral-700" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-neutral-800">
                <h2 className="text-base font-bold text-neutral-100">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

FilterDrawer.displayName = "FilterDrawer";

export { FilterDrawer };
