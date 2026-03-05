"use client";

import { useState, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface Column<T> {
  key: string;
  header: string;
  /** Render a custom cell; receives the full row */
  render?: (row: T) => ReactNode;
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Accessor function for sorting (required if sortable) */
  sortAccessor?: (row: T) => string | number | Date;
  /** Header alignment */
  headerAlign?: "left" | "center" | "right";
  /** Minimum width class (e.g. "min-w-[200px]") */
  minWidth?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Key extractor for each row */
  rowKey: (row: T) => string;
  /** Optional actions column renderer */
  actions?: (row: T) => ReactNode;
  /** No data message */
  emptyMessage?: string;
  /** Extra className for the wrapper */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* DataTable                                                           */
/* ------------------------------------------------------------------ */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  actions,
  emptyMessage = "No data found.",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortAccessor) return data;

    return [...data].sort((a, b) => {
      const aVal = col.sortAccessor!(a);
      const bVal = col.sortAccessor!(b);

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500",
                  col.headerAlign === "center" && "text-center",
                  col.headerAlign === "right" && "text-right",
                  !col.headerAlign && "text-left",
                  col.minWidth,
                  col.sortable && "cursor-pointer select-none hover:text-neutral-700",
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-neutral-400">
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-12 text-center text-neutral-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={rowKey(row)}
                className="hover:bg-neutral-50/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-neutral-700",
                      col.headerAlign === "center" && "text-center",
                      col.headerAlign === "right" && "text-right",
                      col.minWidth,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
