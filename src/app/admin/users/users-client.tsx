"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { DataTable, type Column } from "@/components/admin/data-table";

interface UserRow {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  tier: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  listingsCount: number;
}

interface AdminUsersClientProps {
  users: UserRow[];
  query: string;
  roleFilter: string;
  page: number;
  totalPages: number;
  total: number;
}

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller" },
  { value: "ADMIN", label: "Admin" },
];

const roleColorMap: Record<string, "default" | "success" | "secondary"> = {
  BUYER: "default",
  SELLER: "success",
  ADMIN: "secondary",
};

const tierColorMap: Record<string, string> = {
  BRONZE: "bg-amber-700/10 text-amber-700",
  SILVER: "bg-neutral-400/10 text-neutral-400",
  GOLD: "bg-secondary/15 text-secondary",
};

export function AdminUsersClient({
  users,
  query,
  roleFilter,
  page,
  totalPages,
  total,
}: AdminUsersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query);

  const pushParams = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.role) sp.set("role", params.role);
    if (params.page && params.page !== "1") sp.set("page", params.page);
    startTransition(() => {
      router.push(`/admin/users?${sp.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({ q: search, role: roleFilter, page: "1" });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pushParams({ q: search, role: e.target.value, page: "1" });
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to change role:", err);
    }
  };

  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "User",
      minWidth: "min-w-[220px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.image} size="sm" />
          <div>
            <p className="font-medium text-neutral-100">{row.name}</p>
            <p className="text-xs text-neutral-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <Badge variant={roleColorMap[row.role] ?? "default"}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (row) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            tierColorMap[row.tier] ?? "bg-neutral-800 text-neutral-400",
          )}
        >
          {row.tier}
        </span>
      ),
    },
    {
      key: "city",
      header: "City",
      sortable: true,
      sortAccessor: (row) => row.city,
    },
    {
      key: "listingsCount",
      header: "Listings",
      headerAlign: "center",
      sortable: true,
      sortAccessor: (row) => row.listingsCount,
      render: (row) => (
        <span className="text-center block">{row.listingsCount}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "error"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-neutral-800">
        <form onSubmit={handleSearch} className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </form>
        <div className="w-full sm:w-48">
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={handleRoleChange}
            placeholder="Filter by role"
          />
        </div>
      </div>

      {/* Table */}
      <div className={cn(isPending && "opacity-60 pointer-events-none transition-opacity")}>
        <DataTable
          columns={columns}
          data={users}
          rowKey={(row) => row.id}
          emptyMessage="No users found."
          actions={(row) => (
            <>
              <select
                className="text-xs border border-neutral-800 rounded px-1.5 py-1 bg-neutral-900 text-neutral-300 cursor-pointer"
                value={row.role}
                onChange={(e) => handleChangeRole(row.id, e.target.value)}
                title="Change role"
              >
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="button"
                onClick={() => handleToggleActive(row.id, row.isActive)}
                className={cn(
                  "rounded-lg p-1.5 transition-colors cursor-pointer",
                  row.isActive
                    ? "text-neutral-400 hover:text-error hover:bg-error/15"
                    : "text-neutral-400 hover:text-success hover:bg-success/15",
                )}
                title={row.isActive ? "Deactivate user" : "Activate user"}
              >
                {row.isActive ? (
                  <Ban className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
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
            {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                pushParams({
                  q: search,
                  role: roleFilter,
                  page: String(page - 1),
                })
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
                pushParams({
                  q: search,
                  role: roleFilter,
                  page: String(page + 1),
                })
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
