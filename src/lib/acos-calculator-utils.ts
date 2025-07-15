import Papa from "papaparse";
import { calculateMetrics } from "@/lib/acos-utils";
import {
  AcosCampaignData,
  ManualCampaignInput,
} from "@/components/amazon-seller-tools/acos-calculator/types";
import { GenericCsvRow } from "@/components/amazon-seller-tools/CsvUploader";
import { ApiError } from "@/lib/api-errors";
import { useToast } from "@/hooks/use-toast"; // Re-add useToast import
import { useError } from "@/context/error-context"; // Import useError

// Helper function for showing toasts (now uses useError)
export const showToast = (
  toast: ReturnType<typeof useToast>["toast"], // Keep toast for success messages
  showError: ReturnType<typeof useError>["showError"],
  title: string,
  description: string,
  variant: "default" | "destructive" = "default",
) => {
  if (variant === "destructive") {
    showError(title, description);
  } else {
    toast({
      title: title,
      description: description,
      variant: variant,
    });
  }
};

// Helper function for validating manual input
export const validateManualInput = (
  manualCampaign: ManualCampaignInput,
  setManualErrors: (errors: {
    campaign: string;
    adSpend: string;
    sales: string;
  }) => void,
) => {
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
  return { hasError, adSpend, sales };
};

// Helper function for handling manual calculation
export const handleManualCalculateLogic = (
  manualCampaign: ManualCampaignInput,
  campaigns: AcosCampaignData[],
  setCampaigns: (campaigns: AcosCampaignData[]) => void,
  setManualCampaign: (manualCampaign: ManualCampaignInput) => void,
  toast: ReturnType<typeof useToast>["toast"],
  showError: ReturnType<typeof useError>["showError"], // Use showError from useError
  validateInput: (
    manualCampaign: ManualCampaignInput,
    setManualErrors: (errors: {
      campaign: string;
      adSpend: string;
      sales: string;
    }) => void,
  ) => { hasError: boolean; adSpend: number; sales: number },
  setManualErrors: (errors: {
    campaign: string;
    adSpend: string;
    sales: string;
  }) => void,
) => {
  const { hasError, adSpend, sales } = validateInput(
    manualCampaign,
    setManualErrors,
  );

  if (hasError) {
    showError(
      "Input Error",
      "Please correct the errors in the manual input form.",
    );
    return;
  }

  const metrics = calculateMetrics({ adSpend, sales });

  const newCampaign: AcosCampaignData = {
    campaign: manualCampaign.campaign,
    adSpend,
    sales,
    ...metrics,
  };

  setCampaigns([...campaigns, newCampaign]);
  setManualCampaign({ campaign: "", adSpend: "", sales: "" });
  showToast(
    toast,
    showError,
    "Campaign Added",
    "Campaign data added successfully",
  );
};

// Helper function for handling export
export const handleExportLogic = (
  campaigns: AcosCampaignData[],
  showError: ReturnType<typeof useError>["showError"], // Use showError from useError
  toast: ReturnType<typeof useToast>["toast"], // Keep toast for success messages
) => {
  if (campaigns.length === 0) {
    showError("Export Error", "No data to export");
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
    showToast(
      toast,
      showError,
      "Export Success",
      "Campaign data exported successfully",
    );
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
    showError(
      `Export Error: ${apiError.errorType || "Unknown"}`,
      apiError.message,
      apiError,
    );
  }
};

// Helper function for clearing data
export const clearDataLogic = (
  clearAllData: () => void,
  toast: ReturnType<typeof useToast>["toast"], // Keep toast for success messages
  showError: ReturnType<typeof useError>["showError"], // Use showError from useError
) => {
  clearAllData();
  showToast(toast, showError, "Data Cleared", "Campaign data cleared");
};

// Helper function for handling upload success
export const handleUploadSuccessLogic = (
  data: GenericCsvRow[],
  setCampaigns: (campaigns: AcosCampaignData[]) => void,
  showError: ReturnType<typeof useError>["showError"], // Use showError from useError
  setIsLoading: (isLoading: boolean) => void,
) => {
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
    showError(
      `Processing Failed: ${apiError.errorType || "Unknown"}`,
      apiError.message,
      apiError,
    );
  } finally {
    setIsLoading(false);
  }
};
