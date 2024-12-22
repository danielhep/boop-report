import { parseOrcaFileCsvSync, processAllRows } from "../processingUtils";
import type { OrcaCSVRow, OrcaStats } from "../types";
import { readFileSync } from "node:fs";
import path from "node:path";

export function findUndefinedRouteNames(rows: OrcaCSVRow[]): {line: string | undefined, agency: string, time: Date}[] {
    const processed = processAllRows(rows);
    return processed
      .filter(row => row.routeShortName === undefined && row.line !== undefined)
      .map(row => ({
        line: row.line,
        agency: row.agency,
        time: row.time
      }))
      .filter((value, index, self) => 
        // Remove duplicates
        index === self.findIndex(t => 
          t.line === value.line && t.agency === value.agency
        )
      )
  }

export function loadAndProcessTestFile(fileName: string): OrcaStats {
  const csvPath = path.join(__dirname, "../../test_files", fileName);
  const fileContent = readFileSync(csvPath, "utf-8");
  return parseOrcaFileCsvSync(fileContent, fileName);
}