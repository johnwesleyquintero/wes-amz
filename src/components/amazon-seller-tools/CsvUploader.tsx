"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertCircle, CheckCircle2 } from "lucide-react";
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
  validationSchema?: { [key: string]: string }; // e.g., { column1: "number", column2: "string" }
};

export interface GenericCsvRow {
  [key: string]: unknown;
}

type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

const validateRow = (
  row: GenericCsvRow,
  validationSchema: { [key: string]: string },
): ValidationResult => {
  for (const column in validationSchema) {
    const expectedType = validationSchema[column];
    const value = row[column];

    if (value === undefined || value === null) {
      return {
        isValid: false,
        errorMessage: `Column "${column}" is missing.`,
      };
    }

    switch (expectedType) {
      case "number":
        if (typeof value !== "number" && isNaN(Number(value))) {
          return {
            isValid: false,
            errorMessage: `Column "${column}" must be a number.`,
          };
        }
        break;
      case "string":
        if (typeof value !== "string") {
          return {
            isValid: false,
            errorMessage: `Column "${column}" must be a string.`,
          };
        }
        break;
      // Add more cases for other data types as needed (e.g., "boolean", "date")
    }
  }
  return { isValid: true };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CsvUploader<T extends GenericCsvRow>({
  onUploadSuccess,
  isLoading,
  onClear,
  hasData,
  requiredColumns,
  dataType,
  fileName,
  validationSchema,
}: CsvUploaderProps<T>) {
  const { toast } = useToast();
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileNameDisplay, setFileNameDisplay] = useState<string | null>(null);
  const [accumulatedData, setAccumulatedData] = useState<T[]>([]);
  const workerRef = useRef<Worker>();
  const validationSchemaRef = useRef<{ [key: string]: string } | undefined>(
    null,
  );

  useEffect(() => {
    validationSchemaRef.current = validationSchema;
  }, [validationSchema]);

  const showErrorToast = useCallback(
    (title: string, description: string) => {
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    },
    [toast],
  );

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

          // Validate data types based on validationSchema
          if (validationSchemaRef.current) {
            for (const row of accumulatedData) {
              const validationResult = validateRow(
                row,
                validationSchemaRef.current!,
              );
              if (!validationResult.isValid) {
                setParsingError(
                  validationResult.errorMessage || "Validation failed",
                );
                toast({
                  title: "Error",
                  description:
                    validationResult.errorMessage || "Validation failed",
                  variant: "destructive",
                });
                setAccumulatedData([]); // Clear data on error
                return;
              }
            }
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

  const parseCsv = useCallback(
    (file: File) => {
      setIsParsing(true);
      setParsingError(null);
      setProgress(0);
      setFileNameDisplay(file.name); // Set file name for display
      setAccumulatedData([]); // Clear accumulated data before new parse
      workerRef.current?.postMessage({
        file,
        validationSchema: validationSchemaRef.current,
      });
    },
    [validationSchemaRef],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setParsingError(null); // Clear previous errors
      setFileNameDisplay(null); // Clear previous file name display
      setAccumulatedData([]); // Clear accumulated data on new file drop
      if (acceptedFiles.length === 0) {
        showErrorToast("Upload Error", "No file selected.");
        return;
      }

      const file = acceptedFiles[0];

      if (!file.name.endsWith(".csv")) {
        showErrorToast("Upload Error", "Only CSV files are supported.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showErrorToast(
          "Upload Error",
          `File size exceeds the maximum limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`,
        );
        return;
      }

      if (file.size === 0) {
        showErrorToast("Upload Error", "The file is empty.");
        return;
      }

      parseCsv(file);
    },
    [parseCsv, showErrorToast],
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
