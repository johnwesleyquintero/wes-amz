import { useState, useCallback } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { analyzeCampaignData } from "@/lib/utils/ppc-analyzer";
import type { CampaignData } from "@/types/ppc-audit-types";
import { GenericCsvRow } from "@/components/amazon-seller-tools/CsvUploader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PPC_CAMPAIGN_QUERY_KEY = ["ppcCampaigns"];

// Mock function to simulate fetching data (will be replaced by mutation)
const fetchPpcCampaigns = async (): Promise<CampaignData[]> => {
  // In a real app, this would fetch from an API.
  // For now, we'll return an empty array or cached data if available.
  return [];
};

export function usePpcAuditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery<CampaignData[]>({
    queryKey: PPC_CAMPAIGN_QUERY_KEY,
    queryFn: fetchPpcCampaigns,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // We'll trigger refetches manually
  });

  const processUploadedDataMutation = useMutation({
    mutationFn: async (data: GenericCsvRow[]) => {
      const parsedData = data
        .map((row) => ({
          name: String(row.name || ""),
          type: String(row.type || ""),
          spend: Number(row.spend || 0),
          sales: Number(row.sales || 0),
          impressions: Number(row.impressions || 0),
          clicks: Number(row.clicks || 0),
        }))
        .filter((item) => item.name && item.type);

      if (parsedData.length === 0) {
        throw new Error(
          "No valid campaign data found. Please check your CSV columns: name, type, spend, sales, impressions, clicks.",
        );
      }

      const analyzedData = parsedData.map(analyzeCampaignData);
      return analyzedData;
    },
    onSuccess: (analyzedData) => {
      queryClient.setQueryData(PPC_CAMPAIGN_QUERY_KEY, analyzedData);
      toast({
        title: "Analysis Complete",
        description: `${analyzedData.length} campaigns successfully audited.`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during processing.";
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const exportResultsToCsv = useCallback(() => {
    const currentCampaigns = queryClient.getQueryData<CampaignData[]>([
      "ppcCampaigns",
    ]);

    if (!currentCampaigns || currentCampaigns.length === 0) {
      toast({
        title: "Export Error",
        description: "No data to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = currentCampaigns.map((c) => ({
      Name: c.name,
      Type: c.type,
      Spend: c.spend.toFixed(2),
      Sales: c.sales.toFixed(2),
      ACoS: c.acos.toFixed(2),
      Impressions: c.impressions,
      Clicks: c.clicks,
      CTR: c.ctr.toFixed(2),
      "Conversion Rate": c.conversionRate.toFixed(2),
      Issues: c.issues.join("; "),
      Recommendations: c.recommendations.join("; "),
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ppc_campaign_audit_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Your PPC audit report has been downloaded.",
    });
  }, [toast, queryClient]);

  const clearData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: PPC_CAMPAIGN_QUERY_KEY });
    toast({
      title: "Data Cleared",
      description: "All campaign data has been removed.",
    });
  }, [toast, queryClient]);

  return {
    campaigns,
    isLoading: processUploadedDataMutation.isPending,
    processUploadedData: processUploadedDataMutation.mutate,
    exportResultsToCsv,
    clearData,
    hasData: campaigns.length > 0,
  };
}
