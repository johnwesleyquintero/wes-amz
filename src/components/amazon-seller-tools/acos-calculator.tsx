"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ChartContainer } from "../ui/chart";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import {
  acosRatingGuide,
  calculateMetrics,
  chartConfig,
  getAcosColor,
  getAcosRating,
  type CampaignData,
} from "@/lib/acos-utils";
import {
  AlertCircle,
  Calculator,
  Download,
  FileText,
  Info,
  Upload,
} from "lucide-react";
import Papa from "papaparse";
import type React from "react";
import { useState } from "react";
import CsvUploader, { GenericCsvRow } from "./CsvUploader";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import SampleCsvButton from "./sample-csv-button";
import { useToast } from "@/hooks/use-toast";

// Constants for ACoS ratings
const ACOS_EXCELLENT_THRESHOLD = 25;
const ACOS_GOOD_THRESHOLD = 35;

// Interface for manual campaign input
interface ManualCampaignInput {
  campaign: string;
  adSpend: string;
  sales: string;
}

export default function AcosCalculator() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<
    "acos" | "roas" | "ctr" | "cpc"
  >("acos");
  const [manualCampaign, setManualCampaign] = useState<ManualCampaignInput>({
    campaign: "",
    adSpend: "",
    sales: "",
  });

  const handleManualCalculate = () => {
    // Validate input
    if (!manualCampaign.campaign.trim()) {
      setError("Please enter a campaign name");
      toast({
        title: "Input Error",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return;
    }

    const adSpend = Number.parseFloat(manualCampaign.adSpend);
    const sales = Number.parseFloat(manualCampaign.sales);

    if (isNaN(adSpend) || adSpend < 0) {
      setError("Ad Spend must be a valid positive number");
      toast({
        title: "Input Error",
        description: "Ad Spend must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(sales) || sales < 0) {
      setError("Sales amount must be a valid positive number");
      toast({
        title: "Input Error",
        description: "Sales amount must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (sales === 0) {
      setError(
        "Sales amount cannot be zero as it would result in invalid ACOS calculation",
      );
      toast({
        title: "Input Error",
        description:
          "Sales amount cannot be zero as it would result in invalid ACOS calculation",
        variant: "destructive",
      });
      return;
    }

    // Calculate metrics
    const metrics = calculateMetrics({ adSpend, sales });

    // Create new campaign data
    const newCampaign: CampaignData = {
      campaign: manualCampaign.campaign,
      adSpend,
      sales,
      ...metrics,
    };

    // Update state
    setCampaigns([...campaigns, newCampaign]);
    setManualCampaign({ campaign: "", adSpend: "", sales: "" });
    setError(null);
    toast({
      title: "Campaign Added",
      description: "Campaign data added successfully",
      variant: "default",
    });
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

    try {
      const exportData = campaigns.map((campaign) => ({
        campaign: campaign.campaign,
        adSpend: campaign.adSpend.toFixed(2),
        sales: campaign.sales.toFixed(2),
        acos: campaign.acos?.toFixed(2),
        roas: campaign.roas?.toFixed(2),
        impressions: campaign.impressions || "",
        clicks: campaign.clicks || "",
        ctr: campaign.ctr?.toFixed(2) || "",
        cpc: campaign.cpc?.toFixed(2) || "",
        conversionRate: campaign.conversionRate?.toFixed(2) || "",
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "acos_calculations.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Export Success",
        description: "Campaign data exported successfully",
        variant: "default",
      });
    } catch (error) {
      setError(
        `Error exporting data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      toast({
        title: "Export Error",
        description: `Error exporting data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const clearData = () => {
    setCampaigns([]);
    setError(null);
    toast({
      title: "Data Cleared",
      description: "Campaign data cleared",
      variant: "default",
    });
  };

  const handleUploadSuccess = (data: GenericCsvRow[]) => {
    try {
      const processedData: CampaignData[] = data
        .filter(
          (item: GenericCsvRow) =>
            typeof item.campaign === "string" &&
            item.campaign.trim() !== "" &&
            !isNaN(Number(item.adSpend)) &&
            !isNaN(Number(item.sales)),
        )
        .map((item: GenericCsvRow) => {
          const adSpend = Number(item.adSpend);
          const sales = Number(item.sales);
          const impressions = item.impressions
            ? Number(item.impressions)
            : undefined;
          const clicks = item.clicks ? Number(item.clicks) : undefined;

          return {
            campaign: String(item.campaign),
            adSpend,
            sales,
            impressions,
            clicks,
            ...calculateMetrics({ adSpend, sales, impressions, clicks }),
          };
        });

      if (processedData.length === 0) {
        setError(
          "No valid data found in CSV. Please ensure your CSV has columns: campaign, adSpend, sales",
        );
        toast({
          title: "CSV Error",
          description:
            "No valid data found in CSV. Please ensure your CSV has columns: campaign, adSpend, sales",
          variant: "destructive",
        });
        return;
      }

      setCampaigns(processedData);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(
        `Failed to process CSV data: ${
          err instanceof Error ? err.message : String(err)
        }. Please ensure your CSV has the correct format`,
      );
      toast({
        title: "Processing Failed",
        description: `Failed to process CSV data: ${
          err instanceof Error ? err.message : String(err)
        }. Please ensure your CSV has the correct format`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Your CSV file should have the following columns:{" "}
            <code>campaign</code>, <code>adSpend</code>, <code>sales</code>
          </p>
          <p>
            Optional columns: <code>impressions</code>, <code>clicks</code>
          </p>
          <p className="mt-1">
            Example: <code>campaign,adSpend,sales,impressions,clicks</code>
            <br />
            <code>
              Auto Campaign - Wireless Earbuds,245.67,1245.89,12450,320
            </code>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* CsvUploader Integration */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <CsvUploader
              onUploadSuccess={handleUploadSuccess}
              isLoading={isLoading}
              onClear={clearData}
              hasData={campaigns.length > 0}
              requiredColumns={["campaign", "adSpend", "sales"]}
              dataType="acos"
              fileName="sample-acos-calculator.csv"
            />
          </CardContent>
        </Card>

        {/* Manual input card */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="space-y-4 p-2">
              <h3 className="text-lg font-medium">Manual Calculator</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input
                    value={manualCampaign.campaign}
                    onChange={(e) =>
                      setManualCampaign({
                        ...manualCampaign,
                        campaign: e.target.value,
                      })
                    }
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ad Spend ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={manualCampaign.adSpend}
                    onChange={(e) =>
                      setManualCampaign({
                        ...manualCampaign,
                        adSpend: e.target.value,
                      })
                    }
                    placeholder="Enter ad spend amount"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sales ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={manualCampaign.sales}
                    onChange={(e) =>
                      setManualCampaign({
                        ...manualCampaign,
                        sales: e.target.value,
                      })
                    }
                    placeholder="Enter sales amount"
                  />
                </div>
                <Button onClick={handleManualCalculate} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate ACoS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {campaigns.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Ad Spend
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Sales
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      ACoS
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      ROAS
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3 text-sm">{campaign.campaign}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        ${campaign.adSpend.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        ${campaign.sales.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right text-sm font-medium ${getAcosColor(
                          campaign.acos || 0,
                        )}`}
                      >
                        {campaign.acos?.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {campaign.roas?.toFixed(2)}x
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            campaign.acos &&
                            campaign.acos < ACOS_EXCELLENT_THRESHOLD
                              ? "default"
                              : campaign.acos &&
                                  campaign.acos < ACOS_GOOD_THRESHOLD
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {getAcosRating(campaign.acos || 0)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
