import Papa from "papaparse";

export type ExportFormat = "csv" | "json" | "txt";

interface ExportOptions {
  fileName?: string;
  format?: ExportFormat;
  fields?: string[];
}

export function downloadFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function exportData<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {},
) {
  const {
    fileName = "export",
    format = "csv",
    fields = Object.keys(data[0] || {}),
  } = options;

  const timestamp = new Date().toISOString().split("T")[0];
  const fullFileName = `${fileName}_${timestamp}.${format}`;

  let content = "";
  switch (format) {
    case "csv":
      content = Papa.unparse(data, {
        fields,
        header: true,
      });
      break;
    case "json":
      content = JSON.stringify(data, null, 2);
      break;
    case "txt":
      content = data
        .map((item) =>
          fields.map((field) => `${field}: ${item[field]}`).join("\n"),
        )
        .join("\n\n");
      break;
  }

  downloadFile(content, fullFileName);
}
