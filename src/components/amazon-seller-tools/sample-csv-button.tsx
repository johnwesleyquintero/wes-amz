"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadSampleCsv } from "@/lib/generate-sample-csv";
import { useToast } from "@/hooks/use-toast";

type SampleDataType =
  | "fba"
  | "keyword"
  | "ppc"
  | "keyword-dedup"
  | "acos"
  | "sales-estimator";

interface SampleCsvButtonProps {
  dataType: SampleDataType;
  fileName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  buttonText?: string;
}

export default function SampleCsvButton({
  dataType,
  fileName,
  variant = "outline",
  size = "sm",
  className,
  buttonText = "Download Sample CSV",
}: SampleCsvButtonProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      downloadSampleCsv(dataType, fileName);
    } catch (error) {
      console.error("Error downloading sample CSV:", error);
      toast({
        title: "Error",
        description: "Failed to download sample CSV.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
