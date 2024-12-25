import { differenceInMilliseconds, parse } from "date-fns";
import Papa from "papaparse";
import {
	type OrcaCSVRow,
	type ProcessedOrcaRow,
	type ExtraDataType,
	ActivityType,
	type ProcessedOrcaCard,
	type UnprocessedOrcaCard,
	type IndividualRouteOccurrences,
	type LinkStats,
	type LinkStationStats,
	type IndividualAgencyOccurences,
	type DayRideCount,
	type OrcaStats,
	type VehicleOccurrence,
	type StopOccurrence,
} from "./types";
import {
	agencyOccurrences,
	linkStats,
	ridesByDate,
	routeOccurrences,
	vehicleOccurrences,
	stopOccurrences,
} from "./basicStats";
import {
	dollarStringToNumber,
	parseActivity,
	parseReaderNumber,
} from "./propertyTransformations";
import { findTripsFromTaps } from "./findTripsFromTaps";
import { lineToRouteShortName } from "./shortNameMap";

function isFile(file: unknown): file is File {
	return file instanceof File;
}

/**
 * @param file File or string containing CSV
 * @returns Parsed Array<OrcaCSVRow>
 */
async function parseFile(file: File | string): Promise<UnprocessedOrcaCard> {
	return await new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			complete: (res) => {
				resolve({
					rawCsvRows: res.data as OrcaCSVRow[],
					fileName: file instanceof File ? file.name : file,
				});
			},
			error: (err) => reject(err),
		});
	});
}

/**
 * Returns the first three characters of each word in the string joined by a `-`, sorted alphabetically,
 * with the suffix "Ferry" added on.
 * e.g. `Mukilteo - Clinton` and `Clinton - Mukilteo` both become `Cli-Muk Ferry`.
 */
function getWSFRoute(string: string): string | undefined {
	const abbreviated = string.match(/(\b)[A-HJ-Z]\w{0,2}/g)?.sort();
	const shortened = abbreviated?.join("-");
	return shortened ? `${shortened} Ferry` : undefined;
}

/**
 * Returns first two characters of each destination, unless it's multiple words (e.g. Port Orchard),
 * in which case it's abbreviated, preserving ferry type.
 * e.g. `Bremerton-Port Orchard Foot Ferry` becomes `Br-PO Foot Ferry`.
 */
function getKitsapFerryRoute(string: string): string | undefined {
	const nameParts = string.match(/(.+) (Fast|Foot) Ferry/);
	const name = nameParts?.[1];
	const type = nameParts?.[2];
	if (name && type) {
		const locations = name
			.split("-")
			.map((p) => p.trim())
			.map((p) => {
				if (p.includes(" ")) {
					return p.match(/(\b)\w/g)?.join("") ?? p;
				}
				return p.substring(0, 2);
			});
		return `${locations.join("-")} ${type} ⛴️`;
	}
}

/**
 * Main method for getting a user-facing route name from an ORCA record.
 */
export function getIdealRouteShortName(
	row: OrcaCSVRow,
	time: Date,
	lineStr: string | undefined,
): string | undefined {
	if (lineStr) {
		const routeNumberMatch = lineStr.match(/(Swift \w+)|(\w+[\s-]Line)|\d+/);
		if (routeNumberMatch) {
			return routeNumberMatch[0];
		}
		if (row.Agency === "Washington State Ferries") {
			return getWSFRoute(lineStr);
		}
		if (
			row.Agency === "Kitsap Transit" &&
			lineStr.toLowerCase().includes("ferry")
		) {
			return getKitsapFerryRoute(lineStr);
		}
		return lineToRouteShortName(time, lineStr);
	}
}

export function processAllRows(rows: OrcaCSVRow[]): ProcessedOrcaRow[] {
	return (
		rows?.map<ProcessedOrcaRow>((row) => {
			const time = parse(
				`${row.Date} ${row.Time}`,
				"M/d/yyyy h:mmaa",
				new Date(),
			);
			const lineStr = row.Location.match(/Line: ([^,]*)/)?.[1].trim();
			const stopStr = row.Location.match(/Stop: (.*)/)?.[1].trim();
			const routeShortName = getIdealRouteShortName(row, time, lineStr);

			return {
				cost: dollarStringToNumber(row["+/-"]) * -1, //func returns Number matching sign of input. We want to represent cost, so flip this, so charges are positive and credits are negative
				balance: dollarStringToNumber(row.Balance),
				time,
				line: lineStr,
				stop: stopStr,
				routeShortName,
				agency: row.Agency,
				activity: parseActivity(row.Activity),
				readerNumber: parseReaderNumber(row.Activity),
				declined: row.Activity.toLowerCase().includes("declined"),
			};
		}) || []
	);
}

function generateExtraDataObject(data: ProcessedOrcaRow[]): ExtraDataType {
	const trips = findTripsFromTaps(data);

	const interval =
		trips.length > 0
			? {
					start: trips[0].boarding.time,
					end: trips[trips.length - 1].boarding.time,
				}
			: { start: new Date(), end: new Date() }; // Default interval if no trips

	return {
		routeOccurrences: routeOccurrences(trips.map((t) => t.boarding)),
		agencyOccurrences: agencyOccurrences(trips.map((t) => t.boarding)),
		vehicleOccurrences: vehicleOccurrences(trips.map((t) => t.boarding)),
		stopOccurrences: stopOccurrences(trips.map((t) => t.boarding)),
		ridesByDate: ridesByDate(trips, interval),
		trips: trips,
		tapOffBehavior: {
			expected: trips.filter((t) => t.expectsTapOff).length,
			missing: trips.filter((t) => t.isMissingTapOff).length,
		},
		linkStats: linkStats(trips),
		totalTaps: data.length,
	};
}

export function processOrcaCard(
	unprocessedOrcaCard: UnprocessedOrcaCard,
): ProcessedOrcaCard {
	const processed = processAllRows(unprocessedOrcaCard.rawCsvRows);
	return {
		processed: processed,
		extraData: generateExtraDataObject(processed),
		fileName: unprocessedOrcaCard.fileName,
		rawCsvRows: unprocessedOrcaCard.rawCsvRows,
	};
}

function findProblematicData(orcaData: ProcessedOrcaCard[]) {
	// Find rows of processed data which do not have a populated routeShortName
	for (const card of orcaData) {
		for (const row of card.processed) {
			if (
				!row.routeShortName &&
				row.line &&
				(row.activity === ActivityType.BOARDING ||
					row.activity === ActivityType.TRANSFER)
			) {
				// Bugsnag.notify(new Error("missing routeShortName"), (e) =>
				//   e.addMetadata("row", row)
				// );
			}
		}
	}
}

function aggregateExtraDataObjects(
	cardData: ProcessedOrcaCard[],
): ExtraDataType {
	const extraDataObjects = cardData.map((cd) => cd.extraData);

	const routeOccurrences = extraDataObjects
		.flatMap((edo) => edo.routeOccurrences)
		.reduce<IndividualRouteOccurrences[]>((prev, cur) => {
			const indexOfMatch = prev.findIndex(
				(p) =>
					p.routeShortName === cur.routeShortName &&
					p.agencyName === cur.agencyName,
			);
			if (indexOfMatch !== -1) {
				prev[indexOfMatch].count += cur.count;
			} else {
				prev.push(cur);
			}
			return prev;
		}, []);

	const agencyOccurrences = extraDataObjects
		.flatMap((edo) => edo.agencyOccurrences)
		.reduce<IndividualAgencyOccurences[]>((prev, cur) => {
			const indexOfMatch = prev.findIndex((p) => p.agency === cur.agency);
			if (indexOfMatch !== -1) {
				prev[indexOfMatch].count += cur.count;
			} else {
				prev.push(cur);
			}
			return prev;
		}, []);

	const vehicleOccurrences = extraDataObjects
		.flatMap((edo) => edo.vehicleOccurrences)
		.reduce<VehicleOccurrence[]>((prev, cur) => {
			const indexOfMatch = prev.findIndex(
				(p) => p.vehicleId === cur.vehicleId && p.agencyName === cur.agencyName,
			);
			if (indexOfMatch !== -1) {
				prev[indexOfMatch].count += cur.count;
			} else {
				prev.push(cur);
			}
			return prev;
		}, []);

	const stopOccurrences = extraDataObjects
		.flatMap((edo) => edo.stopOccurrences)
		.reduce<StopOccurrence[]>((prev, cur) => {
			const indexOfMatch = prev.findIndex(
				(p) => p.stop === cur.stop && p.agencyName === cur.agencyName,
			);
			if (indexOfMatch !== -1) {
				prev[indexOfMatch].count += cur.count;
			} else {
				prev.push(cur);
			}
			return prev;
		}, [])
		.sort((a, b) => b.count - a.count);

	const ridesByDate = extraDataObjects
		.flatMap((edo) => edo.ridesByDate)
		.reduce<DayRideCount[]>((prev, cur) => {
			const indexOfMatch = prev.findIndex((p) => p.day === cur.day);
			if (indexOfMatch !== -1) {
				prev[indexOfMatch].value += cur.value;
			} else {
				prev.push(cur);
			}
			return prev;
		}, [])
		.sort((a, b) => differenceInMilliseconds(a.jsDate, b.jsDate));

	const trips = extraDataObjects.flatMap((edo) => edo.trips);
	const tapOffBehavior = extraDataObjects
		.map((edo) => edo.tapOffBehavior)
		.reduce(
			(prev, cur) => ({
				expected: prev.expected + cur.expected,
				missing: prev.missing + cur.missing,
			}),
			{ expected: 0, missing: 0 },
		);

	const linkStats: LinkStats = {
		linkTrips: extraDataObjects
			.map((edo) => edo.linkStats)
			.flatMap((ls) => ls.linkTrips),
		stationStats: extraDataObjects
			.map((edo) => edo.linkStats)
			.flatMap((ls) => ls.stationStats)
			.reduce<LinkStationStats[]>((prev, cur) => {
				const indexOfMatch = prev.findIndex((p) => p.station === cur.station);
				if (indexOfMatch !== -1) {
					prev[indexOfMatch].count += cur.count;
				} else {
					prev.push(cur);
				}
				return prev;
			}, []),
	};

	const totalTaps = extraDataObjects.reduce(
		(prev, cur) => prev + cur.totalTaps,
		0,
	);

	return {
		routeOccurrences,
		totalTaps,
		agencyOccurrences,
		stopOccurrences,
		ridesByDate,
		trips,
		tapOffBehavior,
		linkStats,
		vehicleOccurrences,
	};
}

export function generateOrcaStats(
	unprocessedOrcaData: UnprocessedOrcaCard[],
	filter2024 = false,
): OrcaStats {
	const processedData: ProcessedOrcaCard[] =
		unprocessedOrcaData.map(processOrcaCard);
	if (filter2024) {
		for (const card of processedData) {
			card.processed = card.processed.filter(row => row.time.getFullYear() === 2024);
			card.extraData = generateExtraDataObject(card.processed);
		}
	}

	findProblematicData(processedData);
	return {
		orcaData: processedData,
		aggregateExtraData: aggregateExtraDataObjects(processedData),
			totalRowCount: processedData
				.map((pd) => pd.processed)
				.reduce((prev, cur) => cur.length + prev, 0),
	};
}

export async function parseOrcaFiles(
	files: (File | undefined)[],
): Promise<UnprocessedOrcaCard[]> {
	const filteredFiles = files.filter(isFile);
	return await Promise.all(filteredFiles.map(parseFile));
}

export function parseOrcaFileCsvSync(
	csvString: string,
	fileName: string,
): OrcaStats {
	const parsedCsv = Papa.parse(csvString, { header: true });
	return generateOrcaStats([
		{
			rawCsvRows: parsedCsv.data as OrcaCSVRow[],
			fileName,
		},
	]);
}
