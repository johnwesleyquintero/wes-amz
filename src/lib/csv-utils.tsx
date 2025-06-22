// lib/csv-utils.tsx
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";

export interface CsvRow {
  asin: string;
  price: string;
  reviews: string;
  rating: string;
  conversion_rate: string;
  click_through_rate: string;
  brands: string;
  keywords: string;
  niche: string;
}

export interface ProcessedRow {
  asin: string;
  price: number;
  reviews: number;
  rating: number;
  conversion_rate: number;
  click_through_rate: number;
  brands: string;
  keywords: string;
  niche: string;
}

const REQUIRED_CSV_HEADERS = [
  "asin",
  "price",
  "reviews",
  "rating",
  "conversion_rate",
  "click_through_rate",
  "brands",
  "keywords",
  "niche",
];

export const processCsvData = (csvData: CsvRow[]): ProcessedRow[] => {
  return csvData.map((row) => ({
    asin: row.asin,
    price: parseFloat(row.price),
    reviews: parseInt(row.reviews),
    rating: parseFloat(row.rating),
    conversion_rate: parseFloat(row.conversion_rate),
    click_through_rate: parseFloat(row.click_through_rate),
    brands: row.brands,
    keywords: row.keywords,
    niche: row.niche,
  }));
};

export const parseAndValidateCsv = async <T extends CsvRow>(
  file: File,
): Promise<{ data: T[]; error: string | null }> => {
  return new Promise((resolve) => {
    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          resolve({
            data: [],
            error: `CSV parsing errors: ${results.errors
              .map((e) => e.message)
              .join(", ")}`,
          });
          return;
        }

        const missingHeaders = REQUIRED_CSV_HEADERS.filter((h) =>
          results.meta.fields ? !results.meta.fields.includes(h) : true,
        );
        if (missingHeaders.length > 0) {
          resolve({
            data: [],
            error: `Missing required columns: ${missingHeaders.join(", ")}`,
          });
          return;
        }

        const processedData = processCsvData(results.data);
        resolve({ data: processedData as T[], error: null });
      },
      error: (error) => {
        resolve({ data: [], error: `Error parsing CSV: ${error.message}` });
      },
    });
  });
};
