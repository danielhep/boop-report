import type { ComponentType } from "react";
import { AUG_2024_SERVICE_CHANGE_DATE } from "./consts";
import { isBefore } from "date-fns";

export interface ProcessedOrcaCard {
  fileName: string;
  processed: ProcessedOrcaRow[];
  extraData: ExtraDataType;
  rawCsvRows: OrcaCSVRow[];
}

export interface OrcaStats {
  orcaData: ProcessedOrcaCard[];
  aggregateExtraData: ExtraDataType;
  totalRowCount: number;
}

export interface OrcaCSVRow {
  "+/-": string;
  Activity: string;
  Agency: string;
  Balance: string;
  Date: string;
  Location: string;
  Time: string;
}

export interface UnprocessedOrcaCard {
  fileName: string;
  rawCsvRows: OrcaCSVRow[];
}

export enum ActivityType {
  TAP_OFF = 0,
  TRANSFER = 1,
  BOARDING = 2,
  PASS_LOADED = 3,
  PURCHASE = 4,
  MONEY_LOAD = 5,
  CARD_SALE = 6,
  INSPECTION = 7,
  USE = 8,
  UNKNOWN = 9,
}

export interface ProcessedOrcaRow {
  cost: number;
  balance: number;
  time: Date;
  /**
   * This represents the raw "line" from the ORCA data. 
   * Sometimes this is the same as the short name, but not always.
   */
  line?: string;
  stop?: string;
  routeShortName?: string;
  agency: string;
  activity: ActivityType;
  declined: boolean;
}

export interface IndividualAgencyOccurences {
  agency: string;
  count: number;
}

export interface IndividualRouteOccurrences {
  line: string | undefined;
  count: number;
  agencyName: string;
  routeShortName?: string;
}

export interface DayRideCount {
  day: string;
  jsDate: Date;
  value: number;
}

export interface ExtraDataType {
  routeOccurrences: Array<IndividualRouteOccurrences>;
  agencyOccurrences: Array<IndividualAgencyOccurences>;
  ridesByDate: Array<DayRideCount>;
  trips: OrcaTrip[];
  tapOffBehavior: {
    expected: number;
    missing: number;
  };
  linkStats: LinkStats;
}

export type DoorSides = "LEFT" | "RIGHT" | "EITHER";

export interface LinkStationStats {
  station: string;
  count: number;
  doorSide: DoorSides;
}

export interface LinkStats {
  stationStats: Array<LinkStationStats>;
  linkTrips: OrcaTrip[];
}

/**
 * Represents a single trip on a single route, possibly including tap-off info
 */
export class OrcaTrip {
  /** The boarding event that initiated the trip */
  boarding: ProcessedOrcaRow;
  /** The alighting event that ended the trip, if available. Only if the route requires a tap off. */
  alighting?: ProcessedOrcaRow | undefined;
  /** Any inspection events found to be related to this trip */
  inspections: ProcessedOrcaRow[];

  constructor(boarding: ProcessedOrcaRow, alighting?: ProcessedOrcaRow) {
    this.boarding = boarding;
    this.alighting = alighting;
    this.inspections = [];
  }

  get expectsTapOff(): boolean {
    const routeShortName = this.boarding.routeShortName;
    if (!routeShortName) return false;

    // N-Line and S-Line always require tap off
    if (routeShortName === "N-Line" || routeShortName === "S-Line") {
      return true;
    }

    // 1-Line and 2-Line require tap off only before Aug 2024
    if (routeShortName === "1-Line" || routeShortName === "2-Line") {
      return isBefore(this.boarding.time, AUG_2024_SERVICE_CHANGE_DATE);
    }

    return false;
  }

  get isMissingTapOff(): boolean {
    return this.expectsTapOff && this.alighting == null;
  }

  get wasInspected(): boolean {
    return this.inspections.length > 0;
  }

  /**
   * The initial tap charges the maximum possible amount from that station, but the appropriate amount
   * gets "credited" when you tap off somewhere that isn't the maximum possible charge.
   * Transfer credit and passes are factored in to the amount each tap is charged.
   */
  get charge(): number {
    return this.boarding.cost + (this.alighting?.cost || 0);
  }
}

export interface WrappedCard {
  cardName: string;
  score: (state: OrcaStats) => number;
  Component: ComponentType;
}
