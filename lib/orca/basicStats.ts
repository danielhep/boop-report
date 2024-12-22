import {
	type Interval,
	eachDayOfInterval,
	formatISO,
	isSameDay,
} from "date-fns";
import type {
	DayRideCount,
	DoorSides,
	IndividualAgencyOccurences,
	LinkStats,
	OrcaTrip,
	ProcessedOrcaRow,
	VehicleOccurrence,
	StopOccurrence,
} from "./types";

const LINK_DOOR_SIDE: Record<string, DoorSides> = {
	northgate: "LEFT",
	roosevelt: "LEFT",
	"u district": "LEFT",
	"univeristy of washington": "LEFT",
	"capitol hill": "LEFT",
	westlake: "RIGHT",
	"university street": "RIGHT",
	"pioneer square": "RIGHT",
	"intl dist/chinatown": "RIGHT",
	stadium: "LEFT",
	sodo: "RIGHT",
	"beacon hill": "LEFT",
	"mount baker": "RIGHT",
	"columbia city": "RIGHT",
	othello: "RIGHT",
	"rainier beach": "LEFT",
	"tukwila int'l blvd": "RIGHT",
	"seatac/airport": "LEFT",
	"angle lake": "EITHER",
};

export function ridesByDate(
	data: OrcaTrip[],
	interval: Interval,
): Array<DayRideCount> {
	const everyDay = eachDayOfInterval(interval);
	return everyDay.map((date) => ({
		value: data.filter((d) => isSameDay(d.boarding.time, date)).length,
		day: formatISO(date, { representation: "date" }),
		jsDate: date,
	}));
}

export function agencyOccurrences(
	data: ProcessedOrcaRow[],
): Array<IndividualAgencyOccurences> {
	const dataAsDict = data.reduce<Record<string, number>>((prev, cur) => {
		if (prev[cur.agency]) {
			prev[cur.agency]++;
		} else {
			prev[cur.agency] = 1;
		}
		return prev;
	}, {});
	return Object.keys(dataAsDict)
		.map((agency) => ({
			agency,
			count: dataAsDict[agency],
		}))
		.sort((a, b) => b.count - a.count);
}

export function routeOccurrences(data: ProcessedOrcaRow[]): Array<{
	count: number;
	agencyName: string;
	routeShortName?: string;
}> {
	const countByAgencyThenRoute: {
		// Agency
		[key: string]: {
			// Route
			[key: string]: {
				count: number;
				agencyName: string;
				routeShortName?: string;
			};
		};
	} = {};

	for (const row of data) {
		const shortNameKey = row.routeShortName ?? "UNKNOWN_ROUTE";
		if (!(row.agency in countByAgencyThenRoute)) {
			countByAgencyThenRoute[row.agency] = {};
		}
		if (!(shortNameKey in countByAgencyThenRoute[row.agency])) {
			countByAgencyThenRoute[row.agency][shortNameKey] = {
				count: 0,
				agencyName: row.agency,
				routeShortName: row.routeShortName,
			};
		}
		countByAgencyThenRoute[row.agency][shortNameKey].count += 1;
	}

	const routeCounts = Object.keys(countByAgencyThenRoute)
		.flatMap((agencyName) => {
			return Object.values(countByAgencyThenRoute[agencyName]);
		})
		.filter((d) => d.routeShortName)
		.sort((a, b) => b.count - a.count);

	return routeCounts;
}

export function vehicleOccurrences(data: ProcessedOrcaRow[]): Array<VehicleOccurrence> {
	return data.reduce(
		(acc, row) => {
			if (row.readerNumber?.number && row.readerNumber.type === "BUS") {
				const index = acc.findIndex(
					(v) =>
						v.vehicleId === row.readerNumber?.number &&
						v.agencyName === row.agency,
				);
				if (index === -1) {
					acc.push({
						count: 1,
						vehicleId: row.readerNumber?.number,
						agencyName: row.agency,
					});
				} else {
					acc[index].count++;
				}
			}
			return acc;
		},
		[] as Array<{ count: number; vehicleId: string; agencyName: string }>,
	);
}

export function linkStats(trips: OrcaTrip[]): LinkStats {
	const linkTrips = trips.filter(
		(t) =>
			t.boarding.routeShortName === "1-Line" ||
			t.boarding.routeShortName === "2-Line",
	);
	const stationStats: Record<string, number> = linkTrips.reduce(
		(prev: Record<string, number>, cur) => {
			const stations = [cur.boarding.stop, cur.alighting?.stop];
			for (const s of stations) {
				if (s) {
					if (prev[s] !== undefined) {
						prev[s]++;
					} else {
						prev[s] = 0;
					}
				}
			}
			return prev;
		},
		{},
	);
	const stationStatsAsArray = Object.keys(stationStats)
		.map((station) => ({
			station,
			count: stationStats[station],
			doorSide: LINK_DOOR_SIDE[station.toLowerCase().split(" station")[0]],
		}))
		.sort((a, b) => b.count - a.count);

	return { stationStats: stationStatsAsArray, linkTrips };
}

export function stopOccurrences(data: ProcessedOrcaRow[]): Array<StopOccurrence> {
	const countByStop: Record<string, StopOccurrence> = {};

	for (const row of data) {
		if (row.stop) {
			const key = `${row.stop}|${row.agency}`;
			if (!(key in countByStop)) {
				countByStop[key] = {
					count: 0,
					stop: row.stop,
					agencyName: row.agency,
				};
			}
			countByStop[key].count += 1;
		}
	}

	return Object.values(countByStop).sort((a, b) => b.count - a.count);
}
