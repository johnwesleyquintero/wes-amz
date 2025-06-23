"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Info } from "lucide-react";
import Papa from "papaparse";
import CampaignCard from "./CampaignCard";
import { useToast } from "@/hooks/use-toast";
import CsvUploader, { GenericCsvRow } from "./CsvUploader";
import {
  MIN_CLICKS_FOR_ANALYSIS,
  MAX_ACOS_THRESHOLD,
  MIN_CTR_THRESHOLD,
  MIN_CONVERSION_RATE_THRESHOLD,
} from "@/lib/constants";

export type CampaignData = {
  name: string;
  type: string;
  spend: number;
  sales: number;
  acos?: number;
  adSpend: number;
  impressions: number;
  clicks: number;
  ctr?: number;
  conversionRate?: number;
  issues?: string[];
  recommendations?: string[];
};

const DEFAULT_CAMPAIGN_DATA: CampaignData = {
  name: "",
  type: "",
  spend: 0,
  sales: 0,
  adSpend: 0,
  impressions: 0,
  clicks: 0,
};

const analyzeCampaign = (campaign: CampaignData): CampaignData => {
  const { spend, sales, impressions, clicks, type } = campaign;

  const acos = sales > 0 ? (spend / sales) * 100 : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (sales / clicks) * 100 : 0;

  const issues: string[] = [];
  const recommendations: string[] = [];

  if (acos > MAX_ACOS_THRESHOLD) {
    issues.push("High ACoS");
    recommendations.push("Reduce bids on keywords with high ACoS");
  }

  if (ctr < MIN_CTR_THRESHOLD) {
    issues.push("Low CTR");
    recommendations.push("Improve ad copy and images to increase CTR");
  }

  if (conversionRate < MIN_CONVERSION_RATE_THRESHOLD) {
    issues.push("Low conversion rate");
    recommendations.push(
      "Optimize product listing and target more relevant keywords",
    );
  }

  if (clicks < MIN_CLICKS_FOR_ANALYSIS) {
    issues.push("Low click volume");
    recommendations.push("Increase bids or budget to get more visibility");
  }

  if (type === "Auto" && acos < 20) {
    recommendations.push(
      "Extract converting search terms and create manual campaigns",
    );
  }

  return {
    ...campaign,
    acos,
    ctr,
    conversionRate,
    issues,
    recommendations,
  };
};

export default function PpcCampaignAuditor() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSuccess = (data: GenericCsvRow[]) => {
    setIsLoading(true);
    try {
      const processedData: CampaignData[] = data
        .filter(
          (item) =>
            item.name &&
            item.type &&
            !isNaN(Number(item.spend)) &&
            !isNaN(Number(item.sales)) &&
            !isNaN(Number(item.impressions)) &&
            !isNaN(Number(item.clicks)),
        )
        .map((item) => ({
          ...DEFAULT_CAMPAIGN_DATA,
          name: String(item.name),
          type: String(item.type),
          spend: Number(item.spend),
          sales: Number(item.sales),
          adSpend: Number(item.spend),
          impressions: Number(item.impressions),
          clicks: Number(item.clicks),
        }))
        .map(analyzeCampaign);

      if (processedData.length === 0) {
        toast({
          title: "CSV Error",
          description:
            "No valid data found in CSV. Please ensure your CSV has columns: name, type, spend, sales, impressions, clicks",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setCampaigns(processedData);
      setIsLoading(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process CSV data. Please ensure your CSV has the correct format";
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (campaigns.length === 0) {
      toast({
        title: "Export Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    const exportData = campaigns.map((campaign) => ({
      name: campaign.name,
      type: campaign.type,
      spend: campaign.spend,
      sales: campaign.sales,
      acos: campaign.acos?.toFixed(2),
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      ctr: campaign.ctr?.toFixed(2),
      conversionRate: campaign.conversionRate?.toFixed(2),
      issues: campaign.issues?.join("; "),
      recommendations: campaign.recommendations?.join("; "),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ppc_campaign_audit.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Success",
      description: "Campaign data exported successfully",
      variant: "default",
    });
  };

  const clearData = () => {
    setCampaigns([]);
    toast({
      title: "Data Cleared",
      description: "Campaign data cleared",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm text-foreground dark:text-primary-foreground">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Your CSV file should have the following columns: <code>name</code>,{" "}
            <code>type</code>, <code>spend</code>, <code>sales</code>,{" "}
            <code>impressions</code>, <code>clicks</code>
          </p>
          <p className="mt-1">
            Example: <code>name,type,spend,sales,impressions,clicks</code>
            <br />
            <code>
              Auto Campaign - Wireless Earbuds,Auto,245.67,1245.89,12450,320
            </code>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-4">
            <CsvUploader
              onUploadSuccess={handleUploadSuccess}
              isLoading={isLoading}
              onClear={clearData}
              hasData={campaigns.length > 0}
              requiredColumns={[
                "name",
                "type",
                "spend",
                "sales",
                "impressions",
                "clicks",
              ]}
              dataType="ppc"
              fileName="sample-ppc-campaign.csv"
            />
          </CardContent>
        </Card>
      </div>

      {campaigns.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Audit Report
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={index} campaign={campaign} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
