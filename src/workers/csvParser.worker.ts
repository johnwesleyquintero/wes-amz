import Papa from "papaparse";
import { CsvRow } from "../lib/csv-utils";

self.onmessage = (event) => {
  const { file } = event.data;

  const totalBytes = file.size;
  let bytesRead = 0;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    chunk: (results, parser) => {
      // Post each chunk of data to the main thread
      self.postMessage({ type: "chunk", data: results.data });

      bytesRead += results.meta.cursor; // This is an approximation, as cursor is byte index of the last row.
      const progress = Math.min(
        100,
        Math.round((bytesRead / totalBytes) * 100),
      );
      self.postMessage({ type: "progress", progress });

      if (results.errors.length > 0) {
        parser.abort();
        self.postMessage({
          type: "error",
          message: `CSV parsing errors: ${results.errors
            .map((e) => e.message)
            .join(", ")}`,
        });
      }
    },
    complete: () => {
      // Signal completion without sending accumulated data
      self.postMessage({ type: "complete" });
    },
    error: (error: Error) => {
      self.postMessage({
        type: "error",
        message: `Error parsing CSV: ${error.message}`,
      });
    },
  });
};
