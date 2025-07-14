"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import CsvUploader from "./CsvUploader";
import CampaignCard from "./CampaignCard";
import { usePpcAuditor } from "@/hooks/use-ppc-auditor";
import SampleCsvButton from "./sample-csv-button";

const REQUIRED_COLUMNS = [
  "name",
  "type",
  "spend",
  "sales",
  "impressions",
  "clicks",
];

const AuditorInfoPanel = () => (
  <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg flex items-start gap-3">
    <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
    <div className="text-sm text-foreground dark:text-primary-foreground">
      <p className="font-medium">CSV Format Requirements:</p>
      <p>
        Your CSV file must have the following columns:{" "}
        <code>{REQUIRED_COLUMNS.join(", ")}</code>
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
);

export default function PpcCampaignAuditor() {
  const {
    campaigns,
    processUploadedData,
    exportResultsToCsv,
    isLoading,
    clearData,
  } = usePpcAuditor();

  // Determine if there's data to display based on the campaigns array from the hook
  const hasData = campaigns.length > 0;

  return (
    <div className="space-y-6">
      <AuditorInfoPanel />

      <CsvUploader
        onUploadSuccess={processUploadedData}
        requiredColumns={REQUIRED_COLUMNS}
        isLoading={isLoading}
        onClear={clearData}
        hasData={hasData}
      />
      <SampleCsvButton
        dataType="ppc"
        fileName="sample-ppc-campaign-template.csv"
      />

      {hasData && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={exportResultsToCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export Audit Report
            </Button>
          </div>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={`${campaign.name}-${index}`}
                campaign={campaign}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
