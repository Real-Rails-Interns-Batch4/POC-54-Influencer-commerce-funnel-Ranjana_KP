/**
 * API Route: Download Mock Data
 * Generates and exports mock data as CSV or JSON
 * 
 * Usage:
 * GET /api/download-mock-data?format=csv&region=US&vertical=Fashion
 * GET /api/download-mock-data?format=json&region=ALL&vertical=ALL
 */

import { type NextRequest, NextResponse } from "next/server";
import { generateMockDatasetFiltered } from "@/lib/mock-data/generators";
import { exportToCSV, exportToJSON, getTimestampedFilename } from "@/lib/mock-data/export";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "json"; // csv or json
    const region = searchParams.get("region") || undefined;
    const vertical = searchParams.get("vertical") || undefined;
    const rowCount = parseInt(searchParams.get("rowCount") || "50");

    // Validate format
    if (!["csv", "json"].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be "csv" or "json"' },
        { status: 400 }
      );
    }

    // Generate mock data
    const filterRegion = region === "ALL" ? undefined : region;
    const filterVertical = vertical === "ALL" ? undefined : vertical;
    const data = generateMockDatasetFiltered(rowCount, filterRegion, filterVertical);

    // Export based on format
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === "csv") {
      content = exportToCSV(data);
      mimeType = "text/csv;charset=utf-8;";
      filename = getTimestampedFilename("influencer-funnel-data", "csv");
    } else {
      content = exportToJSON(data);
      mimeType = "application/json;charset=utf-8;";
      filename = getTimestampedFilename("influencer-funnel-data", "json");
    }

    // Return file with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json(
      { error: "Failed to generate download data" },
      { status: 500 }
    );
  }
}
