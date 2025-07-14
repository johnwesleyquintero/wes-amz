import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCsvUploaderStore } from "@/store/csv-uploader-store";
import { GenericCsvRow } from "@/components/amazon-seller-tools/CsvUploader";

interface UseCsvWorkerProps {
  onUploadSuccess: (data: GenericCsvRow[]) => void;
  requiredColumns: string[];
}

export const useCsvWorker = ({
  onUploadSuccess,
  requiredColumns,
}: UseCsvWorkerProps) => {
  const { toast } = useToast();
  const {
    accumulatedData,
    setData,
    setParsingStatus,
    setProgress,
    setError,
    clearState,
  } = useCsvUploaderStore();
  const workerRef = useRef<Worker>();

  const handleProgress = useCallback(
    (progress: number) => setProgress(progress),
    [setProgress],
  );

  const handleChunk = useCallback(
    (data: GenericCsvRow[]) => setData([...accumulatedData, ...data]),
    [accumulatedData, setData],
  );

  const validateColumns = useCallback(
    (data: GenericCsvRow[]) => {
      const missingColumns = requiredColumns.filter(
        (col) => !Object.keys(data[0] || {}).includes(col),
      );
      if (missingColumns.length > 0) {
        const errorMsg = `Missing required columns: ${missingColumns.join(", ")}`;
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return false;
      }
      return true;
    },
    [requiredColumns, setError, toast],
  );

  const handleParsingError = useCallback(
    (message: string) => {
      setParsingStatus(false);
      setError(message);
      setData([]);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    [setParsingStatus, setError, setData, toast],
  );

  const handleComplete = useCallback(
    (data: GenericCsvRow[]) => {
      setParsingStatus(false);
      setProgress(100);

      if (!validateColumns(data)) {
        setData([]);
        return;
      }

      onUploadSuccess(data);
      toast({
        title: "Success",
        description: "File processed successfully",
        variant: "default",
      });
      setData([]);
    },
    [
      requiredColumns,
      toast,
      setData,
      onUploadSuccess,
      setParsingStatus,
      setProgress,
      validateColumns,
    ],
  );

  const handleError = useCallback(
    (message: string) => {
      handleParsingError(`Worker error: ${message}`);
    },
    [handleParsingError],
  );

  const setupWorker = useCallback(() => {
    workerRef.current = new Worker(
      new URL("../workers/csvParser.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const { type, data, message, progress } = event.data;
      switch (type) {
        case "progress":
          handleProgress(progress);
          break;
        case "chunk":
          handleChunk(data);
          break;
        case "complete":
          handleComplete(accumulatedData);
          break;
        case "error":
          handleParsingError(message);
          break;
      }
    };

    workerRef.current.onerror = (error: ErrorEvent) => {
      handleParsingError(`Worker error: ${error.message}`);
    };
  }, [
    accumulatedData,
    handleChunk,
    handleComplete,
    handleProgress,
    handleParsingError,
  ]);

  useEffect(() => {
    setupWorker();
    return () => workerRef.current?.terminate();
  }, [setupWorker]);

  const parseCsv = useCallback(
    (file: File) => {
      clearState();
      setParsingStatus(true);
      workerRef.current?.postMessage({ file });
    },
    [clearState, setParsingStatus],
  );

  return { parseCsv, workerRef };
};
