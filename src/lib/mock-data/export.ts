import type { MockDataRow } from "./generators";

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function convertToCSV<T extends object>(data: T[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const headerRow = headers.map(escapeCsvValue).join(",");
  const rows = data.map((row) =>
    headers.map((header) => escapeCsvValue((row as Record<string, unknown>)[header])).join(",")
  );

  // UTF-8 BOM for Excel compatibility
  return `\uFEFF${headerRow}\n${rows.join("\n")}`;
}

export function getTimestampedFilename(baseName: string, extension: "csv" | "json" | "jsonl"): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  return `${baseName}_${date}_${time}.${extension}`;
}

export function downloadCSV<T extends object>(data: T[], filename = "data.csv") {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

export function downloadJSON(data: unknown, filename = "data.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  triggerDownload(blob, filename);
}

export function downloadJSONL<T extends object>(data: T[], filename = "data.jsonl") {
  const content = data.map((row) => JSON.stringify(row)).join("\n");
  const blob = new Blob([content], { type: "application/x-ndjson;charset=utf-8;" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV<T extends object>(data: T[]) {
  return convertToCSV(data);
}

export function exportToJSON(data: unknown) {
  return JSON.stringify(data, null, 2);
}

export function exportToJSONL<T extends object>(data: T[]) {
  return data.map((row) => JSON.stringify(row)).join("\n");
}

export function exportWithMetadata<T extends object>(data: T[], version = "1.0.0") {
  return {
    metadata: {
      version,
      generated_at: new Date().toISOString(),
      is_synthetic: true,
      row_count: data.length,
    },
    data,
  };
}

export interface ExportFilterOptions {
  regions?: string[];
  verticals?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  onlyEdgeCases?: boolean;
}

export function exportFilteredData(
  data: MockDataRow[],
  filters: ExportFilterOptions,
  format: "csv" | "json" = "csv"
) {
  const filtered = data.filter((row) => {
    if (filters.regions?.length && !filters.regions.includes(row.region)) return false;
    if (filters.verticals?.length && !filters.verticals.includes(row.vertical)) return false;
    if (filters.minRevenue !== undefined && row.order_value < filters.minRevenue) return false;
    if (filters.maxRevenue !== undefined && row.order_value > filters.maxRevenue) return false;
    if (filters.onlyEdgeCases && !row.is_edge_case) return false;
    return true;
  });

  return format === "csv" ? exportToCSV(filtered) : exportToJSON(filtered);
}

export function exportToExcelCSV<T extends object>(data: T[]) {
  return convertToCSV(data);
}
