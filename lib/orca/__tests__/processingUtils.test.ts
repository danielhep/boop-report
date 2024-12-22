import { readdirSync } from "node:fs";
import { describe, test, expect } from "vitest";
import path from "node:path";
import { findUndefinedRouteNames, loadAndProcessTestFile } from "./testUtils";
import { ActivityType, type ProcessedOrcaRow } from "../types";
import { isAfter, isBefore } from "date-fns";
import { AUG_2024_SERVICE_CHANGE_DATE } from "../consts";

describe("Route name processing", () => {
	test("all routes in test files should have a short name", () => {
		const testFilesDir = path.join(__dirname, "../../test_files");
		const csvFiles = readdirSync(testFilesDir).filter((file) =>
			file.endsWith(".csv"),
		);

		for (const csvFile of csvFiles) {
			const processedCard = loadAndProcessTestFile(csvFile);
			const undefinedRoutes = findUndefinedRouteNames(processedCard.orcaData[0].rawCsvRows);

			// Output helpful error message if any routes are undefined
			if (undefinedRoutes.length > 0) {
				console.log(`Missing route definitions in ${csvFile}:`);
				for (const route of undefinedRoutes) {
					console.log("  {");
					console.log(`    line: "${route.line}",`);
					console.log(`    agency: "${route.agency}"`);
					console.log(`    time: "${route.time.toISOString()}"`);
					console.log("  },");
				}
			}

			expect(undefinedRoutes).toHaveLength(0);
		}
	});
});

describe("Tap-off data processing", () => {
	const processedCard = loadAndProcessTestFile("daniel-mobile-wallet.csv");

	test("1-Line and 2-Line trips should not have tap-off data after Aug 30", () => {
		const tapOffDataAfterAug30 = processedCard.orcaData[0].processed.filter(
			(row: ProcessedOrcaRow) => {
				return (
					(row.routeShortName === "1-Line" ||
						row.routeShortName === "2-Line") &&
					isAfter(row.time, AUG_2024_SERVICE_CHANGE_DATE) &&
					row.activity === ActivityType.TAP_OFF
				);
			},
		);

		const tapOffDataBeforeAug30 = processedCard.orcaData[0].processed.filter(
			(row: ProcessedOrcaRow) => {
				return (
					(row.routeShortName === "1-Line" ||
						row.routeShortName === "2-Line") &&
					isBefore(row.time, AUG_2024_SERVICE_CHANGE_DATE) &&
					row.activity === ActivityType.TAP_OFF
				);
			},
		);

		expect(tapOffDataAfterAug30).toHaveLength(0);
		expect(tapOffDataBeforeAug30.length).toBeGreaterThan(0);
	});
	test("check for missing tap off before aug 30", () => {
		const processedCard = loadAndProcessTestFile("tap_on_no_tap_off.csv");
		const tapOffStats = processedCard.orcaData[0].extraData.tapOffBehavior;

		expect(tapOffStats.expected).toBeGreaterThan(0);
		expect(tapOffStats.missing).toBeGreaterThan(0);
		expect(tapOffStats.missing).toBeLessThanOrEqual(tapOffStats.expected);
	});
	test("check for missing tap off after aug 30 (should be none)", () => {
		const processedCard = loadAndProcessTestFile("missing_tap_off_after_aug30.csv");
		const tapOffStats = processedCard.orcaData[0].extraData.tapOffBehavior;

		expect(tapOffStats.expected).toBe(0);
		expect(tapOffStats.missing).toBe(0);
	});
	test("Sounder trips should still require tap-off after Aug 30", () => {
		const processedCard = loadAndProcessTestFile("sounder_missing_tap_off_after_aug30.csv");
		const tapOffStats = processedCard.orcaData[0].extraData.tapOffBehavior;

		expect(tapOffStats.expected).toBeGreaterThan(0);
		expect(tapOffStats.missing).toBeGreaterThan(0);
		expect(tapOffStats.missing).toBeLessThanOrEqual(tapOffStats.expected);
	});

	test("WSF route names are correctly formatted", () => {
		const processedCard = loadAndProcessTestFile("ferry_routes.csv");
		const routes = processedCard.orcaData[0].processed.map(row => row.routeShortName);
    console.log(routes)

		expect(routes).toContain("Bai-Sea Ferry"); // Bremerton-Seattle
		expect(routes).toContain("Edm-Kin Ferry"); // Clinton-Mukilteo

		expect(routes).toContain("Br-PO Foot ⛴️"); // Bremerton-Port Orchard Foot Ferry
		expect(routes).toContain("Br-Se Fast ⛴️"); // Bremerton-Seattle Fast Ferry
		expect(routes).toContain("Se-Ki Fast ⛴️"); // Seattle-Kingston Fast Ferry
	});

	test("Route short names are correctly mapped after service change", () => {
		const processedCard = loadAndProcessTestFile("route_names_after_change.csv");
		const routes = processedCard.orcaData[0].processed.map(row => row.routeShortName);

		// Before Aug 2024
		expect(routes).toContain("510/512"); // Everett-Seattle before change

		// After Aug 2024  
		expect(routes).toContain("510"); // Everett-Seattle after change
		expect(routes).toContain("901"); // Lynnwood City Center Station - Silver Firs
		expect(routes).toContain("909"); // Mountlake Terrace Station - Edmonds Station
	});

	test("Declined transactions are properly flagged", () => {
		const processedCard = loadAndProcessTestFile("declined_transactions.csv");
		const declinedRows = processedCard.orcaData[0].processed.filter(row => row.declined);

		expect(declinedRows.length).toBeGreaterThan(0);
		for (const row of declinedRows) {
      console.log(row)
		}
	});
});
