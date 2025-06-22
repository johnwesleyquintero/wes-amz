"use client";

import { CampaignData } from "./ppc-campaign-auditor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class name merging
import {
  AlertCircle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface CampaignCardProps {
  campaign: CampaignData;
}

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
  const isAcosHigh = campaign.acos > 30;
  const isCtrLow = campaign.ctr < 0.3;
  const isConversionRateLow = campaign.conversionRate < 8;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{campaign.name}</h3>
          <Badge variant="outline">{campaign.type}</Badge>
        </div>

        {/* Issues and Recommendations */}
        {campaign.issues && campaign.issues.length > 0 && (
          <div className="rounded-lg border border-red-500 bg-red-50 p-3 text-red-800">
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
              {isAcosHigh && <TrendingDown className="h-4 w-4 text-red-500" />}
              {!isAcosHigh && campaign.acos !== undefined && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isAcosHigh && "text-red-500",
              )}
            >
              {campaign.acos !== undefined ? campaign.acos.toFixed(2) : "N/A"}%
            </div>
          </div>

          {/* CTR */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              CTR
              {isCtrLow && <TrendingDown className="h-4 w-4 text-red-500" />}
              {!isCtrLow && campaign.ctr !== undefined && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isCtrLow && "text-red-500",
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
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              {!isConversionRateLow &&
                campaign.conversionRate !== undefined && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isConversionRateLow && "text-red-500",
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
