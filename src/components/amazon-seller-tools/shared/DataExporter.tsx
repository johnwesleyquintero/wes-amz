"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportData, ExportFormat } from "@/lib/data-export-utils";

interface DataExporterProps<T extends Record<string, unknown>> {
  data: T[];
  fileName?: string;
  format?: ExportFormat;
  fields?: string[];
  variant?: "default" | "outline" | "secondary";
}

export function DataExporter<T extends Record<string, unknown>>({
  data,
  fileName,
  format = "csv",
  fields,
  variant = "outline",
}: DataExporterProps<T>) {
  const handleExport = () => {
    exportData(data, { fileName, format, fields });
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      <span>Export {format.toUpperCase()}</span>
    </Button>
  );
}
