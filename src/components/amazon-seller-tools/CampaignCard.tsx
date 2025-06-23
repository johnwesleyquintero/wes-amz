"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, TrendingDown } from "lucide-react";
import {
  MAX_ACOS_THRESHOLD,
  MIN_CTR_THRESHOLD,
  MIN_CONVERSION_RATE_THRESHOLD,
} from "@/lib/constants";
import { getAcosColor } from "@/lib/acos-utils";
import { CampaignCardProps } from "./CampaignCard/types";

/**
 * CampaignCard component displays detailed information and performance metrics for a single campaign.
 * It highlights key issues and provides recommendations based on predefined thresholds.
 *
 * @param {CampaignCardProps} { campaign } - The campaign data to display.
 */
export default function CampaignCard({ campaign }: CampaignCardProps) {
  const hasData =
    campaign.spend !== undefined &&
    campaign.sales !== undefined &&
    campaign.acos !== undefined &&
    campaign.ctr !== undefined &&
    campaign.conversionRate !== undefined &&
    campaign.impressions !== undefined &&
    campaign.clicks !== undefined;

  if (!hasData) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            No data available for this campaign.
          </div>
        </CardContent>
      </Card>
    );
  }

  const roas = campaign.sales / campaign.adSpend;
  const isAcosHigh = campaign.acos > MAX_ACOS_THRESHOLD;
  const isCtrLow = campaign.ctr < MIN_CTR_THRESHOLD;
  const isConversionRateLow =
    campaign.conversionRate < MIN_CONVERSION_RATE_THRESHOLD;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{campaign.name}</h3>
          <Badge variant="outline">{campaign.type}</Badge>
        </div>

        {/* Issues and Recommendations */}
        {campaign.issues && campaign.issues.length > 0 && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-destructive-foreground">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <h4 className="font-medium">Issues Detected:</h4>
            </div>
            <ul className="mt-2 list-disc list-inside">
              {campaign.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
            {campaign.recommendations &&
              campaign.recommendations.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Recommendations:</h4>
                  <ul className="mt-2 list-disc list-inside">
                    {campaign.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {/* Spend */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Spend</div>
            <div className="text-xl font-semibold">
              ${campaign.spend.toFixed(2)}
            </div>
          </div>

          {/* Sales */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Sales</div>
            <div className="text-xl font-semibold">
              ${campaign.sales.toFixed(2)}
            </div>
          </div>

          {/* ROAS */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">ROAS</div>
            <div className="text-xl font-semibold">{roas.toFixed(2)}x</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* ACoS */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              ACoS
              {isAcosHigh && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {!isAcosHigh && campaign.acos !== undefined && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                {
                  green: "text-green-600 dark:text-green-400",
                  emerald: "text-emerald-600 dark:text-emerald-400",
                  yellow: "text-yellow-600 dark:text-yellow-400",
                  orange: "text-orange-600 dark:text-orange-400",
                  red: "text-red-600 dark:text-red-400",
                }[getAcosColor(campaign.acos || 0)],
              )}
            >
              {campaign.acos !== undefined ? campaign.acos.toFixed(2) : "N/A"}%
            </div>
          </div>

          {/* CTR */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              CTR
              {isCtrLow && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {!isCtrLow && campaign.ctr !== undefined && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isCtrLow && "text-destructive",
              )}
            >
              {campaign.ctr !== undefined ? campaign.ctr.toFixed(2) : "N/A"}%
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              Conversion Rate
              {isConversionRateLow && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {!isConversionRateLow &&
                campaign.conversionRate !== undefined && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isConversionRateLow && "text-destructive",
              )}
            >
              {campaign.conversionRate !== undefined
                ? campaign.conversionRate.toFixed(2)
                : "N/A"}
              %
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Impressions */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Impressions</div>
            <div className="text-xl font-semibold">
              {campaign.impressions !== undefined
                ? campaign.impressions.toLocaleString()
                : "N/A"}
            </div>
          </div>

          {/* Clicks */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Clicks</div>
            <div className="text-xl font-semibold">
              {campaign.clicks !== undefined
                ? campaign.clicks.toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
