"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertCircle } from "lucide-react";
import SampleCsvButton from "./sample-csv-button";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";

type CsvUploaderProps<T> = {
  onUploadSuccess: (data: T[]) => void;
  isLoading: boolean;
  onClear: () => void;
  hasData: boolean;
  requiredColumns: string[];
  dataType: "fba" | "keyword" | "ppc" | "keyword-dedup" | "acos";
  fileName: string;
};

export interface GenericCsvRow {
  [key: string]: unknown;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CsvUploader<T extends GenericCsvRow>({
  onUploadSuccess,
  isLoading,
  onClear,
  hasData,
  requiredColumns,
  dataType,
  fileName,
}: CsvUploaderProps<T>) {
  const { toast } = useToast();
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../workers/csvParser.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type, data, message, progress } = event.data;
      switch (type) {
        case "progress":
          setProgress(progress);
          break;
        case "complete": {
          setIsParsing(false);
          setProgress(100);
          const missingColumns = requiredColumns.filter(
            (col) => !Object.keys(data[0] || {}).includes(col),
          );
          if (missingColumns.length > 0) {
            setParsingError(
              `Missing required columns: ${missingColumns.join(", ")}`,
            );
            toast({
              title: "Error",
              description: `Missing required columns: ${missingColumns.join(
                ", ",
              )}`,
              variant: "destructive",
            });
            return;
          }
          onUploadSuccess(data);
          toast({
            title: "Success",
            description: `File processed successfully`,
            variant: "default",
          });
          break;
        }
        case "error":
          setIsParsing(false);
          setParsingError(message);
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
          break;
      }
    };

    workerRef.current.onerror = (error: ErrorEvent) => {
      setIsParsing(false);
      setParsingError(`Worker error: ${error.message}`);
      toast({
        title: "Error",
        description: `Worker error: ${error.message}`,
        variant: "destructive",
      });
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [onUploadSuccess, requiredColumns, toast]);

  const parseCsv = useCallback((file: File) => {
    setIsParsing(true);
    setParsingError(null);
    setProgress(0);
    workerRef.current?.postMessage({ file });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setParsingError(null); // Clear previous errors
      if (acceptedFiles.length === 0) {
        const errorMessage = "No file selected";
        setParsingError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const file = acceptedFiles[0];

      if (!file.name.endsWith(".csv")) {
        const errorMessage = "Only CSV files are supported";
        setParsingError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const errorMessage = `File size exceeds the maximum limit of ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`;
        setParsingError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (file.size === 0) {
        const errorMessage = "The file is empty";
        setParsingError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      parseCsv(file);
    },
    [parseCsv, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <FileText className="mb-2 h-8 w-8 text-primary/60" />
        <span className="text-sm font-medium">Click to upload CSV</span>
        <input {...getInputProps()} disabled={isLoading || isParsing} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
        {(isLoading || isParsing) && (
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">Parsing: {progress}%</p>
          </div>
        )}
        {parsingError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400 mt-4">
            <AlertCircle className="h-5 w-5" />
            <span>{parsingError}</span>
          </div>
        )}
        <SampleCsvButton
          dataType={dataType}
          fileName={fileName}
          className="mt-4"
        />
      </div>
      {hasData && (
        <Button variant="outline" onClick={onClear}>
          Clear Data
        </Button>
      )}
    </div>
  );
}
