"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import DataTable from "@/components/shared/DataTable";
import { getAcosRating } from "@/lib/acos-utils";
import { Calculator, Download, Info } from "lucide-react";
import CsvUploader from "./CsvUploader";
import { ACOS_EXCELLENT_THRESHOLD, ACOS_GOOD_THRESHOLD } from "@/lib/constants";
import { AcosCampaignData } from "./acos-calculator/types";
import { useAcosCalculator } from "./acos-calculator/hooks/use-acos-calculator";

/**
 * ACoSCalculator component for calculating and displaying ACoS (Advertising Cost of Sales) data.
 * Allows for manual input and CSV file uploads.
 */
export default function AcosCalculator() {
  const {
    campaigns,
    isLoading,
    manualCampaign,
    manualErrors,
    handleManualCalculate,
    handleExport,
    clearData,
    handleUploadSuccess,
    setManualCampaign,
    setManualErrors,
  } = useAcosCalculator();

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
          <DataTable
            columns={[
              {
                key: "campaign",
                label: "Campaign",
                sortable: true,
              },
              {
                key: "adSpend",
                label: "Ad Spend",
                sortable: true,
                className: "text-right",
                render: (row: AcosCampaignData) => `$${row.adSpend.toFixed(2)}`,
              },
              {
                key: "sales",
                label: "Sales",
                sortable: true,
                className: "text-right",
                render: (row: AcosCampaignData) => `$${row.sales.toFixed(2)}`,
              },
              {
                key: "acos",
                label: "ACoS",
                sortable: true,
                className: "text-right",
                render: (row: AcosCampaignData) => `${row.acos?.toFixed(2)}%`,
              },
              {
                key: "roas",
                label: "ROAS",
                sortable: true,
                className: "text-right",
                render: (row: AcosCampaignData) => `${row.roas?.toFixed(2)}x`,
              },
              {
                key: "rating",
                label: "Rating",
                className: "text-center",
                render: (campaign: AcosCampaignData) => (
                  <Badge
                    variant={
                      campaign.acos && campaign.acos < ACOS_EXCELLENT_THRESHOLD
                        ? "default"
                        : campaign.acos && campaign.acos < ACOS_GOOD_THRESHOLD
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {getAcosRating(campaign.acos || 0)}
                  </Badge>
                ),
              },
            ]}
            data={campaigns}
            filterable
          />
        </>
      )}
    </div>
  );
}
