import "dotenv/config";
import { DateTime } from "luxon";
import { Branch } from "../model";

export function getLocalISODate(timeZone: string) {
  return DateTime.now().setZone(timeZone).toISODate();
}

export function getLocalNow(timeZone: string) {
  const simulate = process.env.SIMULATE_HOUR;
  if (simulate) {
    console.log("simulate: ", simulate);
    const simulatedDateTime = DateTime.fromISO(simulate, { setZone: true });
    return simulatedDateTime.setZone(timeZone);
  }
  return DateTime.now().setZone(timeZone);
}

export function getOpeningAndClosingTime(branch: Branch) {
  const { opening, closing, timeZone } = branch;
  const cleanOpening = opening.slice(0, 5);
  const cleanClosing = closing.slice(0, 5);

  const openingTime = DateTime.fromFormat(cleanOpening, "HH:mm", { zone: timeZone });
  const closingTime = DateTime.fromFormat(cleanClosing, "HH:mm", { zone: timeZone });

  return { openingTime, closingTime };
}

export function getDateToQuery(branch: Branch) {
  const { opening, closing, timeZone } = branch;
  const now = getLocalNow(timeZone);
  const hourIntervalStart = now.hour;

  const openingHour = parseInt(opening.split(":")[0], 10);
  const closingHour = parseInt(closing.split(":")[0], 10);

  let date = getLocalISODate(timeZone);

  const branchHoursPassMidnight = closingHour < openingHour;

  if (branchHoursPassMidnight) {
    const isAfterPassNight = hourIntervalStart >= 0 && hourIntervalStart <= closingHour;

    if (isAfterPassNight) {
      date = now.minus({ days: 1 }).toISODate();
    }
  }
  return { date, hourIntervalStart };
}
export function getDateToQueryMonitoring(branch: Branch) {
  const { opening, closing, timeZone } = branch;
  const now = getLocalNow(timeZone);
  const hourIntervalStart = now.hour + (now.minute < 30 ? 0.0 : 0.5);
  const openingHour = parseInt(opening.split(":")[0], 10);
  const closingHour = parseInt(closing.split(":")[0], 10);

  let date = getLocalISODate(timeZone);

  const branchHoursPassMidnight = closingHour < openingHour;

  if (branchHoursPassMidnight) {
    const isAfterPassNight = hourIntervalStart >= 0 && hourIntervalStart <= closingHour;

    if (isAfterPassNight) {
      date = now.minus({ days: 1 }).toISODate();
    }
  }
  return { date, hourIntervalStart };
}
