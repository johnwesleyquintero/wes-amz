"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import SampleCsvButton from "../sample-csv-button";

interface FileUploaderProps {
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  showSampleButton?: boolean;
  sampleFileName?: string;
}

export function FileUploader({
  onFileUpload,
  accept = ".csv",
  showSampleButton = true,
  sampleFileName,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept={accept}
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        <span>Upload File</span>
      </Button>

      {showSampleButton && (
        <SampleCsvButton
          fileName={sampleFileName}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Download Sample</span>
        </SampleCsvButton>
      )}
    </div>
  );
}
