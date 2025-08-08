"use client";

import { Card, CardContent } from "../ui/card";
import { Info } from "lucide-react";
import CsvUploader from "./CsvUploader";
import ManualAcosInputForm from "./acos-calculator/ManualAcosInputForm";
import AcosTable from "./acos-calculator/AcosTable";
import ProgressiveUploader from "@/components/shared/ProgressiveUploader";
import { useAcosCalculator } from "./acos-calculator/hooks/use-acos-calculator";

/**
 * ACoSCalculator component for calculating and displaying ACoS (Advertising Cost of Sales) data.
 * Allows for manual input and CSV file uploads.
 */
export default function AcosCalculator() {
  const {
    campaigns,
    manualCampaign,
    manualErrors,
    handleManualCalculate,
    handleExport,
    clearData,
    handleUploadSuccess,
    setManualCampaign,
    setManualErrors,
    isLoading,
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
        {/* Progressive File Upload */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <ProgressiveUploader
              onFilesProcessed={(files) => {
                const completedFiles = files.filter(f => f.status === "completed");
                if (completedFiles.length > 0) {
                  // Mock data processing - in real app, this would process the actual file data
                  const mockData = Array.from({ length: 10 }, (_, i) => ({
                    campaign: `Campaign ${i + 1}`,
                    adSpend: Math.random() * 1000,
                    sales: Math.random() * 5000,
                  }));
                  handleUploadSuccess(mockData);
                }
              }}
              validation={{
                maxSize: 5 * 1024 * 1024, // 5MB
                allowedTypes: [".csv"],
                requiredColumns: ["campaign", "adSpend", "sales"],
              }}
              title="Upload Campaign Data"
              description="Upload CSV files with your campaign performance data"
              showPreview={true}
            />
          </CardContent>
        </Card>

        {/* Manual input form */}
        <ManualAcosInputForm
          manualCampaign={manualCampaign}
          manualErrors={manualErrors}
          setManualCampaign={setManualCampaign}
          setManualErrors={setManualErrors}
          handleManualCalculate={handleManualCalculate}
        />
      </div>

      <AcosTable campaigns={campaigns} handleExport={handleExport} />
    </div>
  );
}
