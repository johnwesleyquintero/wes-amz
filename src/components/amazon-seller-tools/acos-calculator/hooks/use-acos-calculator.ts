import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { GenericCsvRow } from "../../CsvUploader";
import { useAcosCalculatorStore } from "@/store/acos-calculator-store";
import { useError } from "@/context/error-context"; // Import useError
import {
  showToast,
  validateManualInput,
  handleManualCalculateLogic,
  handleExportLogic,
  clearDataLogic,
  handleUploadSuccessLogic,
} from "@/lib/acos-calculator-utils";

export const useAcosCalculator = () => {
  const { toast } = useToast();
  const {
    campaigns,
    manualCampaign,
    manualErrors,
    setCampaigns,
    setManualCampaign,
    setManualErrors,
    clearAllData,
    isLoading,
    setIsLoading,
  } = useAcosCalculatorStore();

  const { showError } = useError(); // Use showError from ErrorContext

  const showErrorToast = useCallback(
    (title: string, description: string) =>
      showToast(toast, showError, title, description, "destructive"),
    [toast, showError],
  );

  const handleManualCalculate = useCallback(
    () =>
      handleManualCalculateLogic(
        manualCampaign,
        campaigns,
        setCampaigns,
        setManualCampaign,
        toast,
        showError, // Pass showError from ErrorContext
        validateManualInput,
        setManualErrors,
      ),
    [
      manualCampaign,
      campaigns,
      setCampaigns,
      setManualCampaign,
      toast,
      showError, // Add showError to dependencies
      setManualErrors,
    ],
  );

  const handleExport = useCallback(
    () => handleExportLogic(campaigns, showError, toast), // Pass showError from ErrorContext
    [campaigns, showError, toast], // Add showError to dependencies
  );

  const clearData = useCallback(
    () => clearDataLogic(clearAllData, toast, showError), // Pass showError from ErrorContext
    [clearAllData, toast, showError], // Add showError to dependencies
  );

  const handleUploadSuccess = useCallback(
    (data: GenericCsvRow[]) =>
      handleUploadSuccessLogic(
        data,
        setCampaigns,
        showError, // Pass showError from ErrorContext
        setIsLoading,
      ),
    [setCampaigns, showError, setIsLoading], // Add showError to dependencies
  );

  return {
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
  };
};
