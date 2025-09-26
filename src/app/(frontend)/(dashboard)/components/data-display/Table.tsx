"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/fe/lib/utils";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Spinner } from "../feedback/Spinner";

interface TableColumn<T extends Record<string, any> = any> {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps<T extends Record<string, any> = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (record: T, index: number) => void;
  rowKey?: string | ((record: T) => string);
  className?: string;
  size?: "sm" | "md" | "lg";
  striped?: boolean;
  hoverable?: boolean;
  emptyText?: string;
}

type SortOrder = "asc" | "desc" | null;

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  onRowClick,
  rowKey = "id",
  className,
  size = "md",
  striped = true,
  hoverable = true,
  emptyText = "No data available",
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const paddingClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((record) =>
      columns.some((column) => {
        const value = record[column.key];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc"
      );
    } else {
      setSortKey(columnKey);
      setSortOrder("asc");
    }

    if (sortOrder === "desc" && sortKey === columnKey) {
      setSortKey("");
    }
  };

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return String(record[rowKey as keyof T] || index);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl overflow-hidden border-2 border-border shadow-elevation-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b-2 border-border">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      paddingClasses[size],
                      sizeClasses[size],
                      "font-bold text-foreground text-left",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sortable &&
                        "cursor-pointer hover:bg-muted/80 select-none transition-colors",
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end"
                      )}
                    >
                      <span className="uppercase tracking-wide">
                        {column.title}
                      </span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "h-3.5 w-3.5 transition-colors",
                              sortKey === column.key && sortOrder === "asc"
                                ? "text-primary-600"
                                : "text-muted-foreground"
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 -mt-1.5 transition-colors",
                              sortKey === column.key && sortOrder === "desc"
                                ? "text-primary-600"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={cn(paddingClasses[size], "text-center")}
                  >
                    <div className="flex items-center justify-center py-12">
                      <Spinner size="md" />
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={cn(
                      paddingClasses[size],
                      "text-center text-muted-foreground"
                    )}
                  >
                    <div className="py-12 font-medium">{emptyText}</div>
                  </td>
                </tr>
              ) : (
                sortedData.map((record, index) => (
                  <tr
                    key={getRowKey(record, index)}
                    className={cn(
                      "border-b border-border last:border-b-0 transition-colors",
                      striped && index % 2 === 0 && "bg-background-subtle",
                      hoverable && "hover:bg-muted/70",
                      onRowClick && "cursor-pointer active:bg-muted"
                    )}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          paddingClasses[size],
                          sizeClasses[size],
                          "text-foreground font-medium",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(record[column.key], record, index)
                          : String(record[column.key] || "-")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      {!loading && sortedData.length > 0 && (
        <div className="text-sm text-muted-foreground font-medium">
          Showing {sortedData.length} of {data.length}{" "}
          {sortedData.length === 1 ? "result" : "results"}
        </div>
      )}
    </div>
  );
};
