import { useState, useCallback } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { analyzeCampaignData } from "@/lib/utils/ppc-analyzer";
import type { CampaignData } from "@/types/ppc-audit-types";
import { GenericCsvRow } from "@/components/amazon-seller-tools/CsvUploader";

export function usePpcAuditor() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processUploadedData = useCallback(
    (data: GenericCsvRow[]) => {
      setIsLoading(true);
      try {
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
        setCampaigns(analyzedData);

        toast({
          title: "Analysis Complete",
          description: `${analyzedData.length} campaigns successfully audited.`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during processing.";
        toast({
          title: "Processing Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const exportResultsToCsv = useCallback(() => {
    if (campaigns.length === 0) {
      toast({
        title: "Export Error",
        description: "No data to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = campaigns.map((c) => ({
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
  }, [campaigns, toast]);

  const clearData = useCallback(() => {
    setCampaigns([]);
    toast({
      title: "Data Cleared",
      description: "All campaign data has been removed.",
    });
  }, [toast]);

  return {
    campaigns,
    isLoading,
    processUploadedData,
    exportResultsToCsv,
    clearData,
    hasData: campaigns.length > 0,
  };
}
