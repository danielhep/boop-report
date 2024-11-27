import { readFileSync, readdirSync } from 'node:fs';
import { describe, test, expect } from 'vitest';
import Papa from 'papaparse';
import path from 'node:path';
import { findUndefinedRouteNames } from './testUtils';
import type { OrcaCSVRow } from '../types';

describe('Route name processing', () => {
  test('all routes in test files should have a short name', () => {
    const testFilesDir = path.join(__dirname, '../../test_files');
    const csvFiles = readdirSync(testFilesDir).filter(file => file.endsWith('.csv'));

    for (const csvFile of csvFiles) {
      // Read and parse each CSV file
      const csvPath = path.join(testFilesDir, csvFile);
      const fileContent = readFileSync(csvPath, 'utf-8');
      const parsedCsv = Papa.parse(fileContent, { header: true });
      const rows = parsedCsv.data;

      // Find undefined routes
      const undefinedRoutes = findUndefinedRouteNames(rows as OrcaCSVRow[]);

      // Output helpful error message if any routes are undefined
      if (undefinedRoutes.length > 0) {
        console.log(`Missing route definitions in ${csvFile}:`);
        for (const route of undefinedRoutes) {
          console.log("  {");
          console.log(`    line: "${route.line}",`);
          console.log(`    agency: "${route.agency}"`);
          console.log("  },");
        };
      }

      expect(undefinedRoutes).toHaveLength(0);
    }
  });
});

