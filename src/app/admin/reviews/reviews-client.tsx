"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { DataTable, type Column } from "@/components/admin/data-table";

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  buyerName: string;
  buyerImage: string | null;
  sellerName: string;
  sellerImage: string | null;
  listingId: string;
  listingTitle: string;
  createdAt: string;
}

interface Props {
  reviews: ReviewRow[];
  page: number;
  totalPages: number;
  total: number;
}

export function AdminReviewsClient({
  reviews,
  page,
  totalPages,
  total,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const pushPage = (newPage: number) => {
    const sp = new URLSearchParams();
    if (newPage > 1) sp.set("page", String(newPage));
    startTransition(() => {
      router.push(`/admin/reviews?${sp.toString()}`);
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/reviews?id=${reviewId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const columns: Column<ReviewRow>[] = [
    {
      key: "buyer",
      header: "Buyer",
      minWidth: "min-w-[160px]",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.buyerName} src={row.buyerImage} size="sm" />
          <span className="text-sm font-medium text-neutral-100">
            {row.buyerName}
          </span>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Seller",
      minWidth: "min-w-[160px]",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.sellerName} src={row.sellerImage} size="sm" />
          <span className="text-sm text-neutral-300">{row.sellerName}</span>
        </div>
      ),
    },
    {
      key: "listingTitle",
      header: "Listing",
      minWidth: "min-w-[180px]",
      render: (row) => (
        <span className="text-sm text-neutral-300 truncate block max-w-[200px]">
          {row.listingTitle}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      headerAlign: "center",
      sortable: true,
      sortAccessor: (row) => row.rating,
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          <span className="text-sm font-semibold">{row.rating}</span>
        </div>
      ),
    },
    {
      key: "comment",
      header: "Comment",
      minWidth: "min-w-[200px]",
      render: (row) => (
        <span className="text-sm text-neutral-500 truncate block max-w-[250px]">
          {row.comment ?? "No comment"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
    },
  ];

  return (
    <div>
      <div className={cn(isPending && "opacity-60 pointer-events-none transition-opacity")}>
        <DataTable
          columns={columns}
          data={reviews}
          rowKey={(row) => row.id}
          emptyMessage="No reviews found."
          actions={(row) => (
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-error hover:bg-error/15 transition-colors cursor-pointer"
              title="Delete review"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
          <p className="text-sm text-neutral-500">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of{" "}
            {total} reviews
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => pushPage(page - 1)}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-neutral-300 font-medium">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => pushPage(page + 1)}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
