"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCsvUploaderStore } from "@/store/csv-uploader-store";

type CsvUploaderProps = {
  onUploadSuccess: (data: GenericCsvRow[]) => void;
  requiredColumns: string[];
  isLoading: boolean;
  onClear: () => void;
  hasData: boolean;
};

export interface GenericCsvRow {
  [key: string]: unknown;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CsvUploader({
  onUploadSuccess,
  isLoading,
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
    accumulatedData,
    setData,
    setParsingStatus,
    setProgress,
    setError,
    setFileName,
    clearState,
  } = useCsvUploaderStore();
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
          setData([...accumulatedData, ...data]);
          break;
        case "complete": {
          setParsingStatus(false);
          setProgress(100);
          const missingColumns = requiredColumns.filter(
            (col) => !Object.keys(accumulatedData[0] || {}).includes(col),
          );
          if (missingColumns.length > 0) {
            const errorMsg = `Missing required columns: ${missingColumns.join(
              ", ",
            )}`;
            setError(errorMsg);
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
            setData([]);
            return;
          }
          onUploadSuccess(accumulatedData);
          toast({
            title: "Success",
            description: `File processed successfully`,
            variant: "default",
          });
          setData([]);
          break;
        }
        case "error":
          setParsingStatus(false);
          setError(message);
          setData([]);
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
          break;
      }
    };

    workerRef.current.onerror = (error: ErrorEvent) => {
      setParsingStatus(false);
      setError(`Worker error: ${error.message}`);
      setData([]);
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
  }, [
    onUploadSuccess,
    requiredColumns,
    toast,
    accumulatedData,
    setData,
    setError,
    setParsingStatus,
    setProgress,
  ]);

  const parseCsv = useCallback(
    (file: File) => {
      clearState();
      setParsingStatus(true);
      setFileName(file.name);
      workerRef.current?.postMessage({ file });
    },
    [clearState, setParsingStatus, setFileName],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      clearState();
      if (acceptedFiles.length === 0) {
        const errorMessage = "No file selected";
        setError(errorMessage);
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
        setError(errorMessage);
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
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (file.size === 0) {
        const errorMessage = "The file is empty";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      parseCsv(file);
    },
    [parseCsv, toast, clearState, setError],
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
