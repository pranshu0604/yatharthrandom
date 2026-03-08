"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  isActive: boolean;
  listingsCount: number;
}

interface Props {
  categories: CategoryRow[];
}

export function AdminCategoriesClient({ categories }: Props) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          icon: newIcon.trim() || undefined,
          description: newDesc.trim() || undefined,
        }),
      });
      setNewName("");
      setNewIcon("");
      setNewDesc("");
      setShowCreate(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: CategoryRow) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon ?? "");
    setEditDesc(cat.description ?? "");
  };

  const handleEdit = async () => {
    if (!editId || !editName.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/categories/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          icon: editIcon.trim() || null,
          description: editDesc.trim() || null,
        }),
      });
      setEditId(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to update category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to toggle category:", err);
    }
  };

  const columns: Column<CategoryRow>[] = [
    {
      key: "icon",
      header: "Icon",
      headerAlign: "center",
      render: (row) =>
        editId === row.id ? (
          <Input
            value={editIcon}
            onChange={(e) => setEditIcon(e.target.value)}
            placeholder="Icon"
            className="w-20 text-xs py-1 px-2"
          />
        ) : (
          <span className="text-center block text-lg">
            {row.icon ?? "--"}
          </span>
        ),
    },
    {
      key: "name",
      header: "Name",
      minWidth: "min-w-[180px]",
      sortable: true,
      sortAccessor: (row) => row.name,
      render: (row) =>
        editId === row.id ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="text-sm py-1 px-2"
          />
        ) : (
          <div>
            <p className="font-medium text-neutral-100">{row.name}</p>
            <p className="text-xs text-neutral-400">{row.slug}</p>
          </div>
        ),
    },
    {
      key: "description",
      header: "Description",
      minWidth: "min-w-[200px]",
      render: (row) =>
        editId === row.id ? (
          <Input
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description"
            className="text-sm py-1 px-2"
          />
        ) : (
          <span className="text-sm text-neutral-500 truncate block max-w-[200px]">
            {row.description ?? "--"}
          </span>
        ),
    },
    {
      key: "listingsCount",
      header: "Listings",
      headerAlign: "center",
      sortable: true,
      sortAccessor: (row) => row.listingsCount,
      render: (row) => (
        <span className="text-center block font-medium">
          {row.listingsCount}
        </span>
      ),
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
      {/* Create form toggle */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <span className="text-sm text-neutral-500">
          {categories.length} categories
        </span>
        <Button
          variant={showCreate ? "ghost" : "primary"}
          size="sm"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Category
            </>
          )}
        </Button>
      </div>

      {/* Inline create form */}
      {showCreate && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-neutral-950 border-b border-neutral-800">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Icon (emoji)"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="w-28"
          />
          <Input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            loading={loading}
            disabled={!newName.trim()}
          >
            Create
          </Button>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(row) => row.id}
        emptyMessage="No categories found."
        actions={(row) =>
          editId === row.id ? (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg p-1.5 text-success hover:bg-success/15 transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => startEdit(row)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-accent hover:bg-accent/15 transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(row.id, row.isActive)}
                className={cn(
                  "rounded-lg p-1.5 transition-colors cursor-pointer",
                  row.isActive
                    ? "text-success hover:text-error hover:bg-error/15"
                    : "text-neutral-400 hover:text-success hover:bg-success/15",
                )}
                title={row.isActive ? "Deactivate" : "Activate"}
              >
                {row.isActive ? (
                  <ToggleRight className="h-4 w-4" />
                ) : (
                  <ToggleLeft className="h-4 w-4" />
                )}
              </button>
            </>
          )
        }
      />
    </div>
  );
}
