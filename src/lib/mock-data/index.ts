// Data Dictionary
export {
  DATA_DICTIONARY,
  dataDictionary,
  getAllFieldsFlattened,
  type DataDictionaryEntity,
  type DataDictionaryField,
} from "./data-dictionary";

// Benchmarks
export {
  COUNTRY_BENCHMARKS,
  VERTICAL_MULTIPLIERS,
  CREATOR_TIERS,
  PLATFORMS,
  CTR_BENCHMARK,
  CVR_BENCHMARK,
} from "./benchmarks";

// Generators
export {
  generateMockDataRow,
  generateMockDataset,
  generateMockDatasetFiltered,
  generateDatasetSummary,
  type MockDataRow,
  type GenerateRowOptions,
} from "./generators";

// Edge Cases
export {
  EDGE_CASES,
  generateEdgeCase,
  generateAllEdgeCases,
  generateEdgeCaseData,
  generateDatasetWithEdgeCases,
  type EdgeCaseDefinition,
} from "./edge-cases";

// Export Functions
export {
  convertToCSV,
  downloadCSV,
  downloadJSON,
  downloadJSONL,
  exportToCSV,
  exportToJSON,
  exportToJSONL,
  exportToExcelCSV,
  exportWithMetadata,
  exportFilteredData,
  getTimestampedFilename,
  type ExportFilterOptions,
} from "./export";

import { generateMockDataset, generateMockDatasetFiltered } from "./generators";
import { generateAllEdgeCases } from "./edge-cases";

export function generateCompleteDataset(count = 50, region?: string, vertical?: string) {
  const base =
    region || vertical
      ? generateMockDatasetFiltered(count, region, vertical)
      : generateMockDataset(count);
  return [...base, ...generateAllEdgeCases()];
}
