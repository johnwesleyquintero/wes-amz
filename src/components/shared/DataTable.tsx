import React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface Column<T> {
  key: keyof T | "actions" | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  filterable?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  className,
  emptyMessage = "No data available",
  filterable = false,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<{
    columnKey: string | null;
    direction: "asc" | "desc" | null;
  }>({
    columnKey: null,
    direction: null,
  });
  const [filter, setFilter] = useState("");

  const sortedData = useMemo(() => {
    if (!sorting.columnKey) return data;

    const column = columns.find((col) => col.key === sorting.columnKey);
    if (!column || !column.sortable) return data;

    const sortFn = (a: T, b: T) => {
      const aValue = a[sorting.columnKey as keyof T];
      const bValue = b[sorting.columnKey as keyof T];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * (sorting.direction === "asc" ? 1 : -1);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return (
          aValue.localeCompare(bValue) * (sorting.direction === "asc" ? 1 : -1)
        );
      }

      return (
        String(aValue).localeCompare(String(bValue)) *
        (sorting.direction === "asc" ? 1 : -1)
      );
    };

    return [...data].sort(sortFn);
  }, [data, sorting, columns]);

  const filteredData = useMemo(() => {
    if (!filter) return sortedData;

    return sortedData.filter((row: T) => {
      return Object.values(row).some((value: unknown) =>
        String(value).toLowerCase().includes(filter.toLowerCase()),
      );
    });
  }, [sortedData, filter]);

  if (filteredData.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const isSortable = column.sortable !== false;
              return (
                <TableHead
                  key={column.key as React.Key}
                  className={cn(
                    column.className,
                    "cursor-pointer",
                    sorting.columnKey === column.key && "font-bold",
                  )}
                  onClick={() => {
                    if (!isSortable) return;
                    if (sorting.columnKey === column.key) {
                      setSorting({
                        columnKey: column.key as string,
                        direction: sorting.direction === "asc" ? "desc" : null,
                      });
                    } else {
                      setSorting({
                        columnKey: column.key as string,
                        direction: "asc",
                      });
                    }
                  }}
                >
                  <div className="flex items-center">
                    {column.label}
                    {sorting.columnKey === column.key && (
                      <CaretSortIcon
                        className={cn(
                          "ml-2 h-4 w-4",
                          sorting.direction === "desc" && "rotate-0",
                          sorting.direction === "asc" && "rotate-180",
                        )}
                      />
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row: T, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell
                  key={column.key as string}
                  className={column.className}
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key as keyof T] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filterable && (
        <div className="p-4">
          <Input
            type="text"
            placeholder="Filter table..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
