"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";

type CsvUploaderProps<T> = {
  onUploadSuccess: (data: T[]) => void;
  isLoading: boolean;
  onClear: () => void;
  hasData: boolean;
  requiredColumns: string[];
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
}: CsvUploaderProps<T>) {
  const { toast } = useToast();
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileNameDisplay, setFileNameDisplay] = useState<string | null>(null);
  const [accumulatedData, setAccumulatedData] = useState<T[]>([]);
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
        case "chunk":
          setAccumulatedData((prevData) => [...prevData, ...data]);
          break;
        case "complete": {
          setIsParsing(false);
          setProgress(100);
          // Perform column validation on the accumulated data
          const missingColumns = requiredColumns.filter(
            (col) => !Object.keys(accumulatedData[0] || {}).includes(col),
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
            setAccumulatedData([]); // Clear data on error
            return;
          }
          onUploadSuccess(accumulatedData);
          toast({
            title: "Success",
            description: `File processed successfully`,
            variant: "default",
          });
          setAccumulatedData([]); // Clear data after successful upload
          break;
        }
        case "error":
          setIsParsing(false);
          setParsingError(message);
          setAccumulatedData([]); // Clear data on error
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
      setAccumulatedData([]); // Clear data on error
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
  }, [onUploadSuccess, requiredColumns, toast, accumulatedData]);

  const parseCsv = useCallback((file: File) => {
    setIsParsing(true);
    setParsingError(null);
    setProgress(0);
    setFileNameDisplay(file.name); // Set file name for display
    setAccumulatedData([]); // Clear accumulated data before new parse
    workerRef.current?.postMessage({ file });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setParsingError(null); // Clear previous errors
      setFileNameDisplay(null); // Clear previous file name display
      setAccumulatedData([]); // Clear accumulated data on new file drop
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
        <input {...getInputProps()} disabled={isLoading || isParsing} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        {(isLoading || isParsing) && (
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
}
