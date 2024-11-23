import { UUID } from "crypto";
import { MetricsService } from "../interface/metrics";
import { ConcurrenceRepositoryImpl } from "../repository/concurrence";
import { BranchServiceImpl } from "./branch";
import { ConcurrenceServiceImpl } from "./concurrence";
import { Concurrence } from "../model";
import { EntranceTypeEnum } from "../model/concurrence";
import toMoney, { toCompactMoney } from "../utils/toMoney";
import { DateTime } from "luxon";

export class MetricsServiceImpl implements MetricsService {
  private repository = new ConcurrenceRepositoryImpl();
  private concurrenceService = new ConcurrenceServiceImpl();
  private branchService = new BranchServiceImpl();

  async getActualByBranchId(BranchId: UUID) {
    const branch = await this.branchService.findById(BranchId);
    const { opening, closing, timeZone, profitPerPerson } = branch;
    let { date } = this.concurrenceService.getAdjustedDateForBranch(opening, closing, timeZone);
    const isBranchOpen = this.branchService.checkIfIsOpen(branch);
    if (!isBranchOpen) {
      date = DateTime.fromISO(date).minus({ days: 1 }).toISODate();
    }
    const concurrences = await this.repository.getActualByBranch(BranchId, date);
    const sortedConcurrencesByHour = this.sortConcurrencesByHour(concurrences, opening, closing);

    const entriesPerHour = await this.getEntriesPerHour(sortedConcurrencesByHour);
    const typeEntries = await this.getTypeEntries(sortedConcurrencesByHour);
    const earningsPerHour = await this.getEarningsPerHour(
      sortedConcurrencesByHour,
      profitPerPerson,
    );
    return { entriesPerHour, typeEntries, earningsPerHour };
  }

  private async getTypeEntries(concurrences: Concurrence[]) {
    const metrics = concurrences.reduce(
      (acc, concurrence) => {
        for (const entranceType of Object.values(EntranceTypeEnum)) {
          const toUpdate = acc.find((metric) => metric.type === entranceType);
          if (toUpdate) {
            toUpdate.total += concurrence[entranceType];
          }
        }
        return acc;
      },
      [
        { type: "paid", total: 0 },
        { type: "free", total: 0 },
        { type: "qr", total: 0 },
        { type: "vip", total: 0 },
        { type: "guests", total: 0 },
      ],
    );

    return {
      metrics: metrics,
    };
  }
  private async getEntriesPerHour(concurrences: Concurrence[]) {
    const metrics = concurrences.map((concurrence) => ({
      hour: concurrence.hourIntervalStart,
      total: concurrence.entries - concurrence.exits,
    }));

    return {
      total: metrics.reduce((acc, metric) => acc + metric.total, 0),
      metrics: metrics,
    };
  }
  private async getEarningsPerHour(concurrences: Concurrence[], profitPerPerson: number) {
    const metrics = concurrences.map((concurrence) => ({
      hour: concurrence.hourIntervalStart,
      total: (concurrence.entries - concurrence.exits) * profitPerPerson,
      label: toCompactMoney((concurrence.entries - concurrence.exits) * profitPerPerson),
    }));

    const total = toMoney(metrics.reduce((acc, metric) => acc + metric.total, 0));

    return {
      total, // Formatea como moneda al final
      metrics,
    };
  }

  private sortConcurrencesByHour(concurrences: Concurrence[], opening: string, closing: string) {
    const openingHour = parseInt(opening.split(":")[0], 10);
    const closingHour = parseInt(closing.split(":")[0], 10);

    const beforeMidnight = concurrences
      .filter((metric) => metric.hourIntervalStart >= openingHour)
      .sort((a, b) => a.hourIntervalStart - b.hourIntervalStart);
    const afterMidnight = concurrences
      .filter((metric) => metric.hourIntervalStart >= 0 && metric.hourIntervalStart <= closingHour)
      .sort((a, b) => a.hourIntervalStart - b.hourIntervalStart);

    return beforeMidnight.concat(afterMidnight);
  }
}
