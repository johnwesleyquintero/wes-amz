import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change = 0,
  icon,
  className,
}: StatCardProps) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className={cn("analytics-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="stat-label">{title}</p>
          <h3 className="dashboard-stat mt-1">{value}</h3>

          {change !== undefined && (
            <div className="flex items-center mt-2">
              {!isNeutral &&
                (isPositive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1 trend-up" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1 trend-down" />
                ))}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive
                    ? "trend-up"
                    : isNeutral
                      ? "text-muted-foreground"
                      : "trend-down",
                )}
              >
                {isPositive && "+"}
                {change}%
              </span>
            </div>
          )}
        </div>

        <div className="p-2 rounded-md bg-iceberg">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
