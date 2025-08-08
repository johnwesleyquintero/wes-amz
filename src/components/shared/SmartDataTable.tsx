import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CaretSortIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import BulkActionToolbar from "./BulkActionToolbar";

interface Column<T> {
  key: keyof T | "actions" | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select" | "number";
  filterOptions?: string[];
}

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary";
  onClick: (selectedIds: string[]) => void;
}

interface SmartDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  filterable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  title?: string;
  description?: string;
  selectable?: boolean;
  bulkActions?: BulkAction[];
  getRowId?: (row: T) => string;
}

const SmartDataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  className,
  emptyMessage = "No data available",
  filterable = false,
  exportable = false,
  onExport,
  title,
  description,
  selectable = false,
  bulkActions = [],
  getRowId = (_, index) => String(index),
}: SmartDataTableProps<T>) => {
  const [sorting, setSorting] = useState<{
    columnKey: string | null;
    direction: "asc" | "desc" | null;
  }>({
    columnKey: null,
    direction: null,
  });
  const [filter, setFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
    let result = sortedData;

    // Apply global filter
    if (filter) {
      result = result.filter((row: T) => {
        return Object.values(row).some((value: unknown) =>
          String(value).toLowerCase().includes(filter.toLowerCase()),
        );
      });
    }

    // Apply column-specific filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        result = result.filter((row: T) => {
          const cellValue = String(row[columnKey as keyof T] || "").toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        });
      }
    });

    return result;
  }, [sortedData, filter, columnFilters]);

  const handleColumnFilter = (columnKey: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const clearAllFilters = () => {
    setFilter("");
    setColumnFilters({});
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredData.map((row, index) => getRowId(row, index)));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, rowId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId));
    }
  };

  const activeFiltersCount = Object.values(columnFilters).filter(Boolean).length + (filter ? 1 : 0);
  const isAllSelected = selectedRows.length === filteredData.length && filteredData.length > 0;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < filteredData.length;

  if (filteredData.length === 0 && data.length > 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {(title || description || filterable || exportable) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {filterable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  {isFilterExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  Filters {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>}
                </Button>
              )}
              {exportable && onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  Export
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="text-center py-8 text-muted-foreground">
          No results found. Try adjusting your filters.
          {activeFiltersCount > 0 && (
            <Button variant="link" onClick={clearAllFilters} className="ml-2">
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {(title || description || filterable || exportable || selectable) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {filterable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                {isFilterExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                Filters {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>}
              </Button>
            )}
            {exportable && onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      {selectable && selectedRows.length > 0 && (
        <BulkActionToolbar
          selectedItems={selectedRows}
          totalItems={filteredData.length}
          onSelectAll={handleSelectAll}
          onClearSelection={() => setSelectedRows([])}
          actions={bulkActions}
        />
      )}

      {filterable && isFilterExpanded && (
        <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Filters</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Global Search</label>
              <Input
                type="text"
                placeholder="Search all columns..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            {columns
              .filter(col => col.filterable !== false)
              .map((column) => (
                <div key={column.key as string}>
                  <label className="text-xs font-medium text-muted-foreground">
                    {column.label}
                  </label>
                  <Input
                    type="text"
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                    value={columnFilters[column.key as string] || ""}
                    onChange={(e) => handleColumnFilter(column.key as string, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => {
                const isSortable = column.sortable !== false;
                return (
                  <TableHead
                    key={column.key as React.Key}
                    className={cn(
                      column.className,
                      isSortable && "cursor-pointer hover:bg-muted/50",
                      sorting.columnKey === column.key && "font-bold",
                    )}
                    onClick={() => {
                      if (!isSortable) return;
                      if (sorting.columnKey === column.key) {
                        setSorting({
                          columnKey: column.key as string,
                          direction: sorting.direction === "asc" ? "desc" : "asc",
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
                      {isSortable && sorting.columnKey === column.key && (
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
            {filteredData.map((row: T, index) => {
              const rowId = getRowId(row, index);
              const isSelected = selectedRows.includes(rowId);
              
              return (
                <TableRow 
                  key={rowId} 
                  className={cn(
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/5"
                  )}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleRowSelect(rowId, checked as boolean)}
                      />
                    </TableCell>
                  )}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredData.length} of {data.length} results
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount === 1 ? '' : 's'} applied)`}
          </span>
          {selectable && selectedRows.length > 0 && (
            <span>
              {selectedRows.length} row{selectedRows.length === 1 ? '' : 's'} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartDataTable;