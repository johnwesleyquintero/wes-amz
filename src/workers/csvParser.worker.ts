import Papa from "papaparse";

interface WorkerMessage {
  file: File;
}

interface WorkerResponse {
  type: "progress" | "chunk" | "complete" | "error";
  data?: unknown[]; // Use unknown for flexible data types
  message?: string;
  progress?: number;
}

const CHUNK_SIZE = 1000; // Process 1000 rows at a time

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { file } = event.data;

  try {
    let processedRows = 0;
    let totalRows = 0;
    const allData: unknown[] = []; // Use unknown[]

    // First pass: count total rows for progress tracking
    Papa.parse(file, {
      step: () => {
        totalRows++;
      },
      complete: () => {
        // Second pass: actual parsing with progress updates
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          chunk: (results) => {
            const validData = results.data.filter((row: unknown) => {
              // Use unknown
              // Basic validation - ensure row has some data
              if (typeof row !== "object" || row === null) return false;
              return Object.values(row).some(
                (value) =>
                  value !== null &&
                  value !== undefined &&
                  String(value).trim() !== "",
              );
            });

            allData.push(...validData);
            processedRows += results.data.length;

            // Send progress update
            const progress = Math.round((processedRows / totalRows) * 100);
            self.postMessage({
              type: "progress",
              progress: progress,
            } as WorkerResponse);

            // Send chunk data if we have enough rows
            if (allData.length >= CHUNK_SIZE) {
              self.postMessage({
                type: "chunk",
                data: allData.splice(0, CHUNK_SIZE),
              } as WorkerResponse);
            }
          },
          complete: () => {
            // Send any remaining data
            if (allData.length > 0) {
              self.postMessage({
                type: "chunk",
                data: allData,
              } as WorkerResponse);
            }

            self.postMessage({
              type: "complete",
              progress: 100,
            } as WorkerResponse);
            // No need to clear allData here, as it's a local variable within this parse call.
            // The CsvUploader component manages its own state for accumulated data.
          },
          error: (error) => {
            self.postMessage({
              type: "error",
              message: `CSV parsing error: ${error.message}`,
            } as WorkerResponse);
          },
        });
      },
      error: (error) => {
        self.postMessage({
          type: "error",
          message: `Failed to analyze CSV: ${error.message}`,
        } as WorkerResponse);
      },
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      message: `Worker error: ${error instanceof Error ? error.message : "Unknown error"}`,
    } as WorkerResponse);
  }
};
