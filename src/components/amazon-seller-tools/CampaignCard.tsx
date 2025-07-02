"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TrendingDown } from "lucide-react";
import {
  MAX_ACOS_THRESHOLD,
  MIN_CTR_THRESHOLD,
  MIN_CONVERSION_RATE_THRESHOLD,
} from "@/lib/constants";
import { getAcosColor } from "@/lib/acos-utils";
import { CampaignCardProps } from "./CampaignCard/types";
import MetricDisplay from "@/components/shared/MetricDisplay"; // Import MetricDisplay

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
          <MetricDisplay
            label="Spend"
            value={campaign.spend?.toFixed(2)}
            unit="$"
          />
          <MetricDisplay
            label="Sales"
            value={campaign.sales?.toFixed(2)}
            unit="$"
          />
          <MetricDisplay label="ROAS" value={roas.toFixed(2)} unit="x" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricDisplay
            label="ACoS"
            value={campaign.acos?.toFixed(2)}
            unit="%"
            statusIcon={
              isAcosHigh ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : campaign.acos !== undefined ? (
                <CheckCircle className="h-4 w-4 text-primary" />
              ) : undefined
            }
            valueClassName={(() => {
              const acosColor = getAcosColor(campaign.acos || 0);
              switch (acosColor) {
                case "status-good":
                  return "text-[--color-status-info]"; // Using info for good/success
                case "status-average":
                  return "text-[--color-status-warning]"; // Using warning for average/poor
                case "status-poor":
                  return "text-[--color-status-warning]"; // Using warning for average/poor
                case "status-critical":
                  return "text-[--color-status-error]"; // Using error for critical
                default:
                  return "";
              }
            })()}
          />
          <MetricDisplay
            label="CTR"
            value={campaign.ctr?.toFixed(2)}
            unit="%"
            statusIcon={
              isCtrLow ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : campaign.ctr !== undefined ? (
                <CheckCircle className="h-4 w-4 text-primary" />
              ) : undefined
            }
            valueClassName={isCtrLow ? "text-destructive" : ""}
          />
          <MetricDisplay
            label="Conversion Rate"
            value={campaign.conversionRate?.toFixed(2)}
            unit="%"
            statusIcon={
              isConversionRateLow ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : campaign.conversionRate !== undefined ? (
                <CheckCircle className="h-4 w-4 text-primary" />
              ) : undefined
            }
            valueClassName={isConversionRateLow ? "text-destructive" : ""}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricDisplay
            label="Impressions"
            value={campaign.impressions?.toLocaleString()}
          />
          <MetricDisplay
            label="Clicks"
            value={campaign.clicks?.toLocaleString()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
