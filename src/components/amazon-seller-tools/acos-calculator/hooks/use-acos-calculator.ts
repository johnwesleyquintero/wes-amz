import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { GenericCsvRow } from "../../CsvUploader";
import { useAcosCalculatorStore } from "@/store/acos-calculator-store";
import { useError } from "@/context/error-context"; // Import useError
import {
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

  const handleManualCalculate = useCallback(() => {
    handleManualCalculateLogic(
      manualCampaign,
      campaigns,
      setCampaigns,
      setManualCampaign,
      showError,
      validateManualInput,
      setManualErrors,
    );
    toast({
      title: "Campaign Added",
      description: "Campaign data added successfully",
    });
  }, [
    manualCampaign,
    campaigns,
    setCampaigns,
    setManualCampaign,
    showError,
    setManualErrors,
    toast,
  ]);

  const handleExport = useCallback(() => {
    handleExportLogic(campaigns, showError);
    toast({
      title: "Export Success",
      description: "Campaign data exported successfully",
    });
  }, [campaigns, showError, toast]);

  const clearData = useCallback(() => {
    clearDataLogic(clearAllData, showError);
    toast({
      title: "Data Cleared",
      description: "Campaign data cleared",
    });
  }, [clearAllData, showError, toast]);

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
