import React from "react";
import { cn } from "@/lib/utils";

interface MetricDisplayProps {
  label: string;
  value: string | number | undefined;
  unit?: string;
  statusIcon?: React.ReactNode;
  valueClassName?: string;
  tooltipContent?: string; // Optional: for future tooltip integration
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  unit,
  statusIcon,
  valueClassName,
}) => {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {statusIcon && statusIcon}
      </div>
      <div className={cn("text-xl font-semibold", valueClassName)}>
        {value !== undefined && value !== null ? value : "N/A"}
        {unit}
      </div>
    </div>
  );
};

export default MetricDisplay;
