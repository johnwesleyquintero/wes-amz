"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import CsvUploader from "./CsvUploader";
import CampaignCard from "./CampaignCard";
import { usePpcAuditor } from "@/hooks/use-ppc-auditor";
import SmartDataTable from "@/components/shared/SmartDataTable";
import { Trash2, Archive, Edit } from "lucide-react";
import RealTimeInsights from "@/components/shared/RealTimeInsights";
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
        <RealTimeInsights 
          data={campaigns} 
          context="ppc" 
          className="mb-6"
        />
      )}

      {hasData && (
        <>
          <SmartDataTable
            title="Campaign Audit Results"
            description="Detailed analysis of your PPC campaigns with performance insights"
            data={campaigns}
            exportable={true}
            onExport={exportResultsToCsv}
            filterable={true}
            selectable={true}
            getRowId={(campaign) => campaign.name}
            bulkActions={[
              {
                id: "archive",
                label: "Archive",
                icon: <Archive className="h-4 w-4" />,
                variant: "outline",
                onClick: (selectedIds) => {
                  console.log("Archive campaigns:", selectedIds);
                  // Implement archive functionality
                },
              },
              {
                id: "delete",
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                variant: "destructive",
                onClick: (selectedIds) => {
                  console.log("Delete campaigns:", selectedIds);
                  // Implement delete functionality
                },
              },
            ]}
            columns={[
              {
                key: "name",
                label: "Campaign Name",
                sortable: true,
                filterable: true,
              },
              {
                key: "type",
                label: "Type",
                sortable: true,
                filterable: true,
                filterType: "select",
                filterOptions: ["Auto", "Manual", "Sponsored Products", "Sponsored Brands"],
              },
              {
                key: "spend",
                label: "Spend",
                sortable: true,
                className: "text-right",
                filterable: true,
                filterType: "number",
                render: (campaign) => `$${campaign.spend.toFixed(2)}`,
              },
              {
                key: "sales",
                label: "Sales",
                sortable: true,
                className: "text-right",
                filterable: true,
                filterType: "number",
                render: (campaign) => `$${campaign.sales.toFixed(2)}`,
              },
              {
                key: "acos",
                label: "ACoS",
                sortable: true,
                className: "text-right",
                filterable: true,
                filterType: "number",
                render: (campaign) => (
                  <span className={cn(
                    campaign.acos > 30 ? "text-red-600 dark:text-red-400" :
                    campaign.acos > 20 ? "text-yellow-600 dark:text-yellow-400" :
                    "text-green-600 dark:text-green-400"
                  )}>
                    {campaign.acos.toFixed(2)}%
                  </span>
                ),
              },
              {
                key: "issues",
                label: "Issues",
                className: "text-center",
                render: (campaign) => (
                  <Badge variant={campaign.issues.length > 0 ? "destructive" : "default"}>
                    {campaign.issues.length}
                  </Badge>
                ),
              },
              {
                key: "actions",
                label: "Actions",
                className: "text-center",
                render: (campaign) => (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
