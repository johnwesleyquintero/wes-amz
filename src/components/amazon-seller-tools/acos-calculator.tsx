"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  calculateMetrics,
  getAcosColor,
  getAcosRating,
} from "@/lib/acos-utils";
import { AlertCircle, Calculator, Download, Info } from "lucide-react";
import Papa from "papaparse";
import { useState, useCallback } from "react";
import CsvUploader, { GenericCsvRow } from "./CsvUploader";
import { useToast } from "@/hooks/use-toast";
import { ACOS_EXCELLENT_THRESHOLD, ACOS_GOOD_THRESHOLD } from "@/lib/constants";
import { ManualCampaignInput, AcosCampaignData } from "./acos-calculator/types";
import { ApiError } from "@/lib/api-errors"; // Import ApiError

/**
 * ACoSCalculator component for calculating and displaying ACoS (Advertising Cost of Sales) data.
 * Allows for manual input and CSV file uploads.
 */
export default function AcosCalculator() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<AcosCampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualCampaign, setManualCampaign] = useState<ManualCampaignInput>({
    campaign: "",
    adSpend: "",
    sales: "",
  });
  const [manualErrors, setManualErrors] = useState({
    campaign: "",
    adSpend: "",
    sales: "",
  });

  /**
   * Displays a toast message for errors.
   * @param title - The title of the toast.
   * @param description - The description of the toast.
   */
  const showErrorToast = useCallback(
    (title: string, description: string) => {
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    },
    [toast],
  );

  /**
   * Handles the manual calculation of ACoS metrics based on user input.
   * Validates input fields and updates the campaigns state with the new data.
   */
  const handleManualCalculate = useCallback(() => {
    let hasError = false;
    const newErrors = { campaign: "", adSpend: "", sales: "" };

    if (!manualCampaign.campaign.trim()) {
      newErrors.campaign = "Campaign name is required";
      hasError = true;
    }

    const adSpend = Number.parseFloat(manualCampaign.adSpend);
    if (isNaN(adSpend) || adSpend < 0) {
      newErrors.adSpend = "Ad Spend must be a valid positive number";
      hasError = true;
    }

    const sales = Number.parseFloat(manualCampaign.sales);
    if (isNaN(sales) || sales < 0) {
      newErrors.sales = "Sales amount must be a valid positive number";
      hasError = true;
    } else if (sales === 0) {
      newErrors.sales = "Sales amount cannot be zero";
      hasError = true;
    }

    setManualErrors(newErrors);

    if (hasError) {
      showErrorToast(
        "Input Error",
        "Please correct the errors in the manual input form.",
      );
      return;
    }

    // Calculate metrics
    const metrics = calculateMetrics({ adSpend, sales });

    // Create new campaign data
    const newCampaign: AcosCampaignData = {
      campaign: manualCampaign.campaign,
      adSpend,
      sales,
      ...metrics,
    };

    // Update state
    setCampaigns([...campaigns, newCampaign]);
    setManualCampaign({ campaign: "", adSpend: "", sales: "" });
    toast({
      title: "Campaign Added",
      description: "Campaign data added successfully",
      variant: "default",
    });
  }, [manualCampaign, campaigns, toast, showErrorToast]);

  /**
   * Handles the export of current campaign data to a CSV file.
   * Displays an error toast if no data is available for export.
   */
  const handleExport = useCallback(() => {
    if (campaigns.length === 0) {
      showErrorToast("Export Error", "No data to export");
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
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              "An unexpected error occurred during export.",
              undefined,
              undefined,
              error,
            );
      showErrorToast(
        `Export Error: ${apiError.errorType || "Unknown"}`,
        apiError.message,
      );
    }
  }, [campaigns, toast, showErrorToast]);

  /**
   * Clears all campaign data from the state.
   */
  const clearData = useCallback(() => {
    setCampaigns([]);
    toast({
      title: "Data Cleared",
      description: "Campaign data cleared",
      variant: "default",
    });
  }, [toast]);

  /**
   * Handles the successful upload and processing of CSV data.
   * Filters and maps the raw CSV data to CampaignData objects,
   * then updates the component's state.
   * @param data - An array of GenericCsvRow objects parsed from the CSV.
   */
  const handleUploadSuccess = useCallback(
    (data: GenericCsvRow[]) => {
      setIsLoading(true);
      try {
        const processedData: AcosCampaignData[] = data
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
          throw new ApiError(
            "No valid data found in CSV. Please ensure your CSV has columns: campaign, adSpend, sales",
            400,
            "CSV_PARSE_ERROR",
          );
        }

        setCampaigns(processedData);
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                "An unexpected error occurred during CSV processing.",
                undefined,
                undefined,
                err,
              );
        showErrorToast(
          `Processing Failed: ${apiError.errorType || "Unknown"}`,
          apiError.message,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [toast, setIsLoading, setCampaigns, showErrorToast],
  );

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
                    onChange={(e) => {
                      setManualCampaign({
                        ...manualCampaign,
                        campaign: e.target.value,
                      });
                      setManualErrors((prev) => ({ ...prev, campaign: "" }));
                    }}
                    placeholder="Enter campaign name"
                    className={
                      manualErrors.campaign ? "border-destructive" : ""
                    }
                  />
                  {manualErrors.campaign && (
                    <p className="text-destructive text-xs mt-1">
                      {manualErrors.campaign}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Ad Spend ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={manualCampaign.adSpend}
                    onChange={(e) => {
                      setManualCampaign({
                        ...manualCampaign,
                        adSpend: e.target.value,
                      });
                      setManualErrors((prev) => ({ ...prev, adSpend: "" }));
                    }}
                    placeholder="Enter ad spend amount"
                    className={manualErrors.adSpend ? "border-destructive" : ""}
                  />
                  {manualErrors.adSpend && (
                    <p className="text-destructive text-xs mt-1">
                      {manualErrors.adSpend}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Sales ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={manualCampaign.sales}
                    onChange={(e) => {
                      setManualCampaign({
                        ...manualCampaign,
                        sales: e.target.value,
                      });
                      setManualErrors((prev) => ({ ...prev, sales: "" }));
                    }}
                    placeholder="Enter sales amount"
                    className={manualErrors.sales ? "border-destructive" : ""}
                  />
                  {manualErrors.sales && (
                    <p className="text-destructive text-xs mt-1">
                      {manualErrors.sales}
                    </p>
                  )}
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

      {/* Removed the local error display as toast is now used */}
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
                        className={`px-4 py-3 text-right text-sm font-medium ${
                          {
                            green: "text-green-600 dark:text-green-400",
                            emerald: "text-emerald-600 dark:text-emerald-400",
                            yellow: "text-yellow-600 dark:text-yellow-400",
                            orange: "text-orange-600 dark:text-orange-400",
                            red: "text-red-600 dark:text-red-400",
                          }[getAcosColor(campaign.acos || 0)]
                        }`}
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
