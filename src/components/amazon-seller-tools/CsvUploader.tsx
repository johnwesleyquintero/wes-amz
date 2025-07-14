"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCsvUploaderStore } from "@/store/csv-uploader-store";
import { useCsvWorker } from "@/hooks/use-csv-worker";

type CsvUploaderProps = {
  onUploadSuccess: (data: GenericCsvRow[]) => void;
  requiredColumns: string[];
  onClear: () => void;
  hasData: boolean;
  isLoading: boolean; // Add isLoading prop
};

export interface GenericCsvRow {
  [key: string]: unknown;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CsvUploader({
  onUploadSuccess,
  onClear,
  hasData,
  requiredColumns,
}: CsvUploaderProps) {
  const { toast } = useToast();
  const {
    isParsing,
    progress,
    parsingError,
    fileNameDisplay,
    setFileName,
    setError,
    clearState,
  } = useCsvUploaderStore();

  const { parseCsv } = useCsvWorker({ onUploadSuccess, requiredColumns });

  const handleFileValidationAndParse = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Only CSV files are supported");
        toast({
          title: "Error",
          description: "Only CSV files are supported",
          variant: "destructive",
        });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        );
        toast({
          title: "Error",
          description: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size === 0) {
        setError("The file is empty");
        toast({
          title: "Error",
          description: "The file is empty",
          variant: "destructive",
        });
        return false;
      }
      return true;
    },
    [setError, toast],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      clearState();
      if (acceptedFiles.length === 0) {
        setError("No file selected");
        toast({
          title: "Error",
          description: "No file selected",
          variant: "destructive",
        });
        return;
      }

      const file = acceptedFiles[0];
      setFileName(file.name);

      if (handleFileValidationAndParse(file)) {
        parseCsv(file);
      }
    },
    [
      clearState,
      setFileName,
      handleFileValidationAndParse,
      parseCsv,
      setError,
      toast,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <CsvUploaderContent
      requiredColumns={requiredColumns}
      fileNameDisplay={fileNameDisplay}
      isParsing={isParsing}
      parsingError={parsingError}
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      isDragActive={isDragActive}
      progress={progress}
      hasData={hasData}
      onClear={onClear}
    />
  );
}

interface CsvUploaderContentProps {
  requiredColumns: string[];
  fileNameDisplay: string | null;
  isParsing: boolean;
  parsingError: string | null;
  getInputProps: () => React.HTMLProps<HTMLInputElement>;
  getRootProps: () => React.HTMLProps<HTMLDivElement>;
  isDragActive: boolean;
  progress: number;
  hasData: boolean;
  onClear: () => void;
}

const CsvUploaderContent: React.FC<CsvUploaderContentProps> = ({
  requiredColumns,
  fileNameDisplay,
  isParsing,
  parsingError,
  getInputProps,
  getRootProps,
  isDragActive,
  progress,
  hasData,
  onClear,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">CSV Format Requirements:</p>
          <p>
            Required columns:{" "}
            {requiredColumns.map((col, index) => (
              <code key={index}>{col}</code>
            ))}
          </p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-background p-6 text-center hover:bg-primary/5"
      >
        {fileNameDisplay && !isParsing && !parsingError && (
          <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
        )}
        {!fileNameDisplay && (
          <FileText className="mb-2 h-8 w-8 text-primary/60" />
        )}
        <span className="text-sm font-medium">
          {fileNameDisplay && !isParsing && !parsingError
            ? `File uploaded: ${fileNameDisplay}`
            : "Click to upload CSV"}
        </span>
        <input {...getInputProps()} disabled={isParsing} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        {isParsing && (
          <div aria-live="polite" aria-atomic="true" className="w-full mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">Parsing: {progress}%</p>
          </div>
        )}
        {parsingError && (
          <div
            aria-live="assertive"
            aria-atomic="true"
            className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400 mt-4"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{parsingError}</span>
          </div>
        )}
      </div>
      {hasData && (
        <Button variant="outline" onClick={onClear}>
          Clear Data
        </Button>
      )}
    </div>
  );
};
