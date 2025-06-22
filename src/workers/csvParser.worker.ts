import Papa from "papaparse";
import { CsvRow } from "../lib/csv-utils";

self.onmessage = (event) => {
  const { file } = event.data;

  const parsedData: CsvRow[] = [];
  const totalBytes = file.size;
  let bytesRead = 0;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    chunk: (results, parser) => {
      parsedData.push(...results.data);
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
      self.postMessage({ type: "complete", data: parsedData });
    },
    error: (error: Error) => {
      self.postMessage({
        type: "error",
        message: `Error parsing CSV: ${error.message}`,
      });
    },
  });
};
