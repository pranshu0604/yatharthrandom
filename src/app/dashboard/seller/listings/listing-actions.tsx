"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Star, MoreVertical } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
interface ListingActionsProps {
  listingId: string;
  status: string;
  featured: boolean;
  canFeature: boolean;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
function ListingActions({
  listingId,
  status,
  featured,
  canFeature,
}: ListingActionsProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "sold" | "toggle-featured") => {
    setLoading(true);
    setMenuOpen(false);
    try {
      const body: Record<string, unknown> = {};

      if (action === "sold") {
        body.status = "SOLD";
      } else if (action === "toggle-featured") {
        body.featured = !featured;
      }

      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Something went wrong");
        return;
      }

      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={loading}
        className="inline-flex items-center justify-center p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 z-40 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1">
            {status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => handleAction("sold")}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <CheckCircle className="h-4 w-4 text-success" />
                Mark as Sold
              </button>
            )}

            {canFeature && status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => handleAction("toggle-featured")}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Star
                  className={`h-4 w-4 ${
                    featured ? "text-secondary fill-secondary" : "text-neutral-400"
                  }`}
                />
                {featured ? "Remove Featured" : "Set as Featured"}
              </button>
            )}

            {status !== "ACTIVE" && !canFeature && (
              <p className="px-4 py-2 text-sm text-neutral-400">
                No actions available
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

ListingActions.displayName = "ListingActions";

export { ListingActions };
