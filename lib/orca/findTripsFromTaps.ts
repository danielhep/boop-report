import { type ProcessedOrcaRow, OrcaTrip, ActivityType } from "./types";

export function findTripsFromTaps(taps: ProcessedOrcaRow[]): OrcaTrip[] {
  const boardingActivities = [ActivityType.BOARDING, ActivityType.TRANSFER];
  const alightingActivities = [ActivityType.TAP_OFF];

  let currentTrip: OrcaTrip | null = null;
  const trips: OrcaTrip[] = [];

  //loop from earliest trips to latest, keeping track of where the user is after each iteration
  for (let i = taps.length - 1; i >= 0; i--) {
    const inspectingActivity = taps[i];
    if (inspectingActivity.declined) {
      continue;
    }
    const activityIsBoarding = boardingActivities.includes(
      inspectingActivity.activity
    );
    const activityIsAlighting = alightingActivities.includes(
      inspectingActivity.activity
    );
    if (currentTrip == null) {
      //if we're not examining a trip already, put this one up if it indicates the start of a trip
      if (activityIsBoarding) {
        currentTrip = new OrcaTrip(inspectingActivity);
      } else if (activityIsAlighting) {
        console.warn(
          `found an alighting for a trip on route ${inspectingActivity.routeShortName} we don't know about at ${i}`
        );
      }
    } else {
      //if we're examining a trip, check for this event's relevance to the trip
      if (activityIsAlighting) {
        //add time proximity requirement?
        if (
          inspectingActivity.routeShortName ===
            currentTrip.boarding.routeShortName &&
          currentTrip.expectsTapOff
        ) {
          currentTrip.alighting = inspectingActivity;
          trips.push(currentTrip);
          currentTrip = null;
        } else {
          console.warn(
            `found an alighting for a trip on route ${inspectingActivity.routeShortName} before a boarding while inspecting route ${currentTrip.boarding.routeShortName} at ${i}`
          );
        }
      } else if (activityIsBoarding) {
        trips.push(currentTrip);
        currentTrip = new OrcaTrip(inspectingActivity);
      } else if (inspectingActivity.activity === ActivityType.INSPECTION) {
        currentTrip.inspections.push(inspectingActivity);
      }
    }
  }
  //in case a trip is currently being inspected (should indicate the user's most recent boarding didn't have a tap off but should have)
  if (currentTrip != null) {
    trips.push(currentTrip);
  }

  return trips;
}
