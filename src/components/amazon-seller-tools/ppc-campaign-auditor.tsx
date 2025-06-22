"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, Download, Info } from "lucide-react";
import Papa from "papaparse";
import SampleCsvButton from "./sample-csv-button";
import CampaignCard from "./CampaignCard";
import { useToast } from "@/hooks/use-toast";

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

const MIN_CLICKS_FOR_ANALYSIS = 100;
const MAX_ACOS_THRESHOLD = 30;
const MIN_CTR_THRESHOLD = 0.3;
const MIN_CONVERSION_RATE_THRESHOLD = 8;

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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (campaigns.length > 0) {
      setError(null);
    }
  }, [campaigns]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse<CampaignData>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setError(
            `Error parsing CSV file: ${result.errors[0].message}. Please check the format.`,
          );
          toast({
            title: "CSV Error",
            description: `Error parsing CSV file: ${result.errors[0].message}. Please check the format.`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        try {
          const processedData: CampaignData[] = result.data
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
            setError(
              "No valid data found in CSV. Please ensure your CSV has columns: name, type, spend, sales, impressions, clicks",
            );
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
          toast({
            title: "CSV Processed",
            description: `Loaded ${processedData.length} campaign data`,
            variant: "default",
          });
          setIsLoading(false);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to process CSV data. Please ensure your CSV has the correct format";
          setError(errorMessage);
          toast({
            title: "Processing Failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV file: ${error.message}`);
        toast({
          title: "CSV Error",
          description: `Error parsing CSV file: ${error.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    if (campaigns.length === 0) {
      setError("No data to export");
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
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Upload Campaign Data</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with your Amazon PPC campaign data
                </p>
              </div>
              <div className="w-full">
                <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5">
                  <FileText className="mb-2 h-8 w-8 text-primary/60" />
                  <span className="text-sm font-medium">
                    Click to upload CSV
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (Download campaign report from Amazon Ads and upload here)
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    ref={fileInputRef}
                  />
                </label>
                <div className="flex justify-center mt-4">
                  <SampleCsvButton
                    dataType="ppc"
                    fileName="sample-ppc-campaign.csv"
                  />
                </div>
                {campaigns.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={clearData}
                  >
                    Clear Data
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive-foreground dark:bg-destructive/30 dark:text-destructive-foreground">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="space-y-2 py-4 text-center">
          <Progress value={45} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Analyzing campaign performance...
          </p>
        </div>
      )}

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
