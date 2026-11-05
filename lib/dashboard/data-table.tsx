"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  keyField?: keyof T;
  onRowClick?: (row: T) => void;
  footer?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  emptyMessage = "No data available",
  keyField,
  onRowClick,
  footer,
  className,
  ...props
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    const key = String(column.key);
    if (sortColumn === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDirection === "desc") setSortColumn(null);
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const dir = sortDirection === "asc" ? 1 : -1;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [data, sortColumn, sortDirection]);

  const cellPadding = compact ? "px-3 py-2" : "px-4 py-3";

  return (
    <div
      className={cn(
        "w-full overflow-auto rounded-xl",
        bordered ? "border border-border" : "",
        className
      )}
      {...props}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  cellPadding,
                  "font-semibold text-muted-foreground whitespace-nowrap",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors"
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => handleSort(col)}
              >
                <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end", col.align === "center" && "justify-center")}>
                  {col.header}
                  {col.sortable && (
                    <span className="text-muted-foreground/60">
                      {sortColumn === String(col.key) ? (
                        sortDirection === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />
                      ) : (
                        <ChevronsUpDown className="size-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {columns.map((col) => (
                  <td key={String(col.key)} className={cellPadding}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn(cellPadding, "text-center text-muted-foreground py-8")}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const key = keyField ? String(row[keyField as string]) : rowIndex;
              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-border last:border-0",
                    striped && rowIndex % 2 === 1 && "bg-muted/30",
                    hoverable && "hover:bg-accent/40 transition-colors duration-100",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => {
                    const rawValue = row[col.key as string];
                    return (
                      <td
                        key={String(col.key)}
                        className={cn(
                          cellPadding,
                          "text-foreground",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right"
                        )}
                      >
                        {col.render ? col.render(rawValue, row) : String(rawValue ?? "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {footer && (
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          {footer}
        </div>
      )}
    </div>
  );
}
