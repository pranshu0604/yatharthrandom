"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";

interface ListingRow {
  id: string;
  title: string;
  image: string | null;
  sellerName: string;
  sellerImage: string | null;
  categoryName: string;
  askingPrice: number;
  priceFormatted: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
}

interface Props {
  listings: ListingRow[];
  statusFilter: string;
  page: number;
  totalPages: number;
  total: number;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "SOLD", label: "Sold" },
  { value: "EXPIRED", label: "Expired" },
  { value: "REJECTED", label: "Rejected" },
];

const statusColorMap: Record<string, "success" | "warning" | "error" | "default" | "secondary"> = {
  ACTIVE: "success",
  PENDING: "warning",
  SOLD: "secondary",
  EXPIRED: "error",
  REJECTED: "error",
};

export function AdminListingsClient({
  listings,
  statusFilter,
  page,
  totalPages,
  total,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const pushParams = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (params.status) sp.set("status", params.status);
    if (params.page && params.page !== "1") sp.set("page", params.page);
    startTransition(() => {
      router.push(`/admin/listings?${sp.toString()}`);
    });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pushParams({ status: e.target.value, page: "1" });
  };

  const adminAction = async (
    listingId: string,
    action: "approve" | "reject" | "feature" | "unfeature" | "delete",
  ) => {
    try {
      await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, action }),
      });
      router.refresh();
    } catch (err) {
      console.error("Admin action failed:", err);
    }
  };

  const columns: Column<ListingRow>[] = [
    {
      key: "title",
      header: "Listing",
      minWidth: "min-w-[260px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                N/A
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-neutral-100 truncate">{row.title}</p>
            <p className="text-xs text-neutral-500">{row.sellerName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      header: "Category",
    },
    {
      key: "priceFormatted",
      header: "Price",
      sortable: true,
      sortAccessor: (row) => row.askingPrice,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusColorMap[row.status] ?? "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      headerAlign: "center",
      render: (row) =>
        row.featured ? (
          <span className="flex justify-center">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
          </span>
        ) : (
          <span className="flex justify-center text-neutral-300">--</span>
        ),
    },
    {
      key: "views",
      header: "Views",
      headerAlign: "center",
      sortable: true,
      sortAccessor: (row) => row.views,
      render: (row) => (
        <span className="text-center block">{row.views}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
        <div className="w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilter}
          />
        </div>
      </div>

      {/* Table */}
      <div className={cn(isPending && "opacity-60 pointer-events-none transition-opacity")}>
        <DataTable
          columns={columns}
          data={listings}
          rowKey={(row) => row.id}
          emptyMessage="No listings found."
          actions={(row) => (
            <>
              {row.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    onClick={() => adminAction(row.id, "approve")}
                    className="rounded-lg p-1.5 text-success hover:bg-success/15 transition-colors cursor-pointer"
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adminAction(row.id, "reject")}
                    className="rounded-lg p-1.5 text-error hover:bg-error/15 transition-colors cursor-pointer"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() =>
                  adminAction(row.id, row.featured ? "unfeature" : "feature")
                }
                className={cn(
                  "rounded-lg p-1.5 transition-colors cursor-pointer",
                  row.featured
                    ? "text-secondary hover:bg-secondary/15"
                    : "text-neutral-400 hover:bg-neutral-800",
                )}
                title={row.featured ? "Remove featured" : "Mark as featured"}
              >
                <Star className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this listing?")) {
                    adminAction(row.id, "delete");
                  }
                }}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-error hover:bg-error/15 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
          <p className="text-sm text-neutral-500">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of{" "}
            {total} listings
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                pushParams({ status: statusFilter, page: String(page - 1) })
              }
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
              onClick={() =>
                pushParams({ status: statusFilter, page: String(page + 1) })
              }
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
