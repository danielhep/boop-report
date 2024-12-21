import { ActivityType, ReaderNumberType, ReaderNumber } from "./types";

export function dollarStringToNumber(val: string): number {
  const split = val.split("$");
  const amount = split[1];
  const isNegative = split[0] === "-";
	return Number(amount) * (isNegative ? -1 : 1);
}

export function parseActivity(activity: string): ActivityType {
  const typeText = activity.split(",")?.[0];

  switch (typeText.toLowerCase()) {
    case "tap off":
      return ActivityType.TAP_OFF;
    case "boarding":
      return ActivityType.BOARDING;
    case "transfer":
      return ActivityType.TRANSFER;
    case "use":
      return ActivityType.USE;
    case "inspection":
      return ActivityType.INSPECTION;
    case "pass loaded on card":
      return ActivityType.PASS_LOADED;
    case "money loaded on card":
      return ActivityType.MONEY_LOAD;
    case "e-purse purchase":
      return ActivityType.PURCHASE;
    case "card sale":
      return ActivityType.CARD_SALE;
    default:
      return ActivityType.UNKNOWN;
  }
}

export function parseReaderNumber(activity: string): ReaderNumber | undefined {
  const regex = /(?:(Bus|Device) number:)\s*(\d+)/;
  const match = activity.match(regex);
  
  if (!match) return undefined;
  
  return {
    type: match[1].toUpperCase() as ReaderNumberType,
    number: match[2]
  };
}