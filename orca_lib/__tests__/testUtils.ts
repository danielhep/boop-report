import { processAllRows } from "../processingUtils";
import type { OrcaCSVRow } from "../types";

export function findUndefinedRouteNames(rows: OrcaCSVRow[]): {line: string | undefined, agency: string}[] {
    const processed = processAllRows(rows);
    return processed
      .filter(row => row.routeShortName === undefined && row.line !== undefined)
      .map(row => ({
        line: row.line,
        agency: row.agency
      }))
      .filter((value, index, self) => 
        // Remove duplicates
        index === self.findIndex(t => 
          t.line === value.line && t.agency === value.agency
        )
      )
  }