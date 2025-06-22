export const exportFormats = ["CSV", "Excel", "PDF", "JSON"] as const;

export type ExportFormat = (typeof exportFormats)[number];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentage(base: number, total: number) {
  return total === 0 ? 0 : Math.round((base / total) * 100);
}

export function validateAmazonAsin(asin: string) {
  return /^[A-Z0-9]{10}$/.test(asin);
}

export function generateExportFilename(toolName: string, format: ExportFormat) {
  const date = new Date().toISOString().slice(0, 10);
  return `${toolName.replace(/ /g, "-")}_${date}.${format.toLowerCase()}`;
}

export function parseCsvNumber(value: string) {
  const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? 0 : num;
}
