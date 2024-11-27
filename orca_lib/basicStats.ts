import {
  type Interval,
  differenceInMilliseconds,
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
  interval: Interval
): Array<DayRideCount> {
  const everyDay = eachDayOfInterval(interval);
  return everyDay.map((date) => ({
    value: data.filter((d) => isSameDay(d.boarding.time, date)).length,
    day: formatISO(date, { representation: "date" }),
    jsDate: date,
  }));
}

export function agencyOccurrences(
  data: ProcessedOrcaRow[]
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
  line: string | undefined;
  count: number;
  agencyName: string;
  routeShortName?: string;
}> {
  const countByAgencyThenRoute: {
    // Agency
    [key: string]: {
      // Route
      [key: string]: {
        line: string | undefined;
        count: number;
        agencyName: string;
        routeShortName?: string;
      };
    };
  } = {};

  for (const row of data) {
    const lineKey = row.line ?? "UNKNOWN_ROUTE";
    if (!(row.agency in countByAgencyThenRoute)) {
      countByAgencyThenRoute[row.agency] = {};
    }
    if (!(lineKey in countByAgencyThenRoute[row.agency])) {
      countByAgencyThenRoute[row.agency][lineKey] = {
        line: row.line,
        count: 0,
        agencyName: row.agency,
        routeShortName: row.routeShortName,
      };
    }
    countByAgencyThenRoute[row.agency][lineKey].count += 1;
  }

  const routeCounts = Object.keys(countByAgencyThenRoute)
    .flatMap((agencyName) => {
      return Object.values(countByAgencyThenRoute[agencyName]);
    })
    .filter((d) => d.line)
    .sort((a, b) => b.count - a.count);

  return routeCounts;
}

export function linkStats(trips: OrcaTrip[]): LinkStats {
  const linkTrips = trips.filter((t) => t.boarding.routeShortName === "1-Line");
  const stationStats: Record<string, number> = linkTrips.reduce((prev: Record<string, number>, cur) => {
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
  }, {});
  const stationStatsAsArray = Object.keys(stationStats)
    .map((station) => ({
      station,
      count: stationStats[station],
      doorSide: LINK_DOOR_SIDE[station.toLowerCase().split(" station")[0]],
    }))
    .sort((a, b) => b.count - a.count);

  return { stationStats: stationStatsAsArray, linkTrips };
}
