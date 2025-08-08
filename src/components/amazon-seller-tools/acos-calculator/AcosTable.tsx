"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AcosCampaignData } from "./types";
import { getAcosRating } from "@/lib/acos-utils";
import { ACOS_EXCELLENT_THRESHOLD, ACOS_GOOD_THRESHOLD } from "@/lib/constants";

interface AcosTableProps {
  campaigns: AcosCampaignData[];
  handleExport: () => void;
}

export default function AcosTable({ campaigns, handleExport }: AcosTableProps) {
  if (campaigns.length === 0) {
    return null;
  }

  return (
      <DataTable
        title="Campaign Analysis Results"
        description="ACoS performance analysis for your campaigns"
        exportable={true}
        onExport={handleExport}
        filterable={true}
        columns={[
          {
            key: "campaign",
            label: "Campaign",
            sortable: true,
            filterable: true,
          },
          {
            key: "adSpend",
            label: "Ad Spend",
            sortable: true,
            className: "text-right",
            filterable: true,
            filterType: "number",
            render: (row: AcosCampaignData) => `$${row.adSpend.toFixed(2)}`,
          },
          {
            key: "sales",
            label: "Sales",
            sortable: true,
            className: "text-right",
            filterable: true,
            filterType: "number",
            render: (row: AcosCampaignData) => `$${row.sales.toFixed(2)}`,
          },
          {
            key: "acos",
            label: "ACoS",
            sortable: true,
            className: "text-right",
            filterable: true,
            filterType: "number",
            render: (row: AcosCampaignData) => `${row.acos?.toFixed(2)}%`,
          },
          {
            key: "roas",
            label: "ROAS",
            sortable: true,
            className: "text-right",
            filterable: true,
            filterType: "number",
            render: (row: AcosCampaignData) => `${row.roas?.toFixed(2)}x`,
          },
          {
            key: "rating",
            label: "Rating",
            className: "text-center",
            filterable: true,
            filterType: "select",
            filterOptions: ["Excellent", "Good", "Average", "Poor", "Critical"],
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
      />
  );
}
