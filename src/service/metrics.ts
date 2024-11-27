import { UUID } from "crypto";
import { DateTime } from "luxon";
import { MetricsService } from "../interface/metrics";
import { Branch, Concurrence } from "../model";
import { EntranceTypeEnum } from "../model/concurrence";
import { getDateToQuery } from "../utils/luxon";
import toMoney, { toCompactMoney } from "../utils/toMoney";
import { BranchServiceImpl } from "./branch";
import { ConcurrenceServiceImpl } from "./concurrence";

export class MetricsServiceImpl implements MetricsService {
  private concurrenceService = new ConcurrenceServiceImpl();
  private branchService = new BranchServiceImpl();

  async getByBranch(BranchId: UUID, queries: any) {
    const branch = await this.branchService.findById(BranchId);
    const { opening, closing, profitPerPerson } = branch;

    let date = this.getDateToQuery(branch, queries.date);
    const isBranchOpen = this.branchService.checkIfIsOpen(branch);
    if (!isBranchOpen) {
      date = DateTime.fromISO(date).minus({ days: 1 }).toISODate();
    }
    const concurrences = await this.concurrenceService.getByBranch(BranchId, date);

    const sortedConcurrencesByHour = this.sortConcurrencesByHour(concurrences, opening, closing);
    const compareVs = JSON.parse(queries.compareVs);

    const entriesPerHour = await this.getEntriesPerHour(
      sortedConcurrencesByHour,
      compareVs["entriesPerHour"],
      BranchId,
      opening,
      closing,
    );
    const typeEntries = await this.getTypeEntries(sortedConcurrencesByHour);
    const earningsPerHour = await this.getEarningsPerHour(
      sortedConcurrencesByHour,
      profitPerPerson,
      compareVs["earningsPerHour"],
      BranchId,
      opening,
      closing,
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
  private async getEntriesPerHour(
    concurrences: Concurrence[],
    compareVs: string,
    BranchId: UUID,
    opening: string,
    closing: string,
  ) {
    const metrics: any = concurrences.map((concurrence) => ({
      hour: concurrence.hourIntervalStart,
      total: concurrence.entries - concurrence.exits,
    }));

    if (metrics.length === 1) {
      metrics.unshift({
        hour: metrics[0].hour - 1,
        total: 0,
      });
    }

    const total = metrics.reduce((acc, metric) => acc + metric.total, 0);

    if (compareVs) {
      console.log("compareVs: ", compareVs);
      const concurrences = await this.concurrenceService.getByBranch(BranchId, compareVs);
      const sortedConcurrences = this.sortConcurrencesByHour(concurrences, opening, closing);

      for (const metric of sortedConcurrences) {
        metrics.find((m) => m.hour === metric.hourIntervalStart).comparison =
          metric.entries - metric.exits;
      }
    }

    return {
      total,
      metrics,
    };
  }

  private async getEarningsPerHour(
    concurrences: Concurrence[],
    profitPerPerson: number,
    compareVs: string,
    BranchId: UUID,
    opening: string,
    closing: string,
  ) {
    const metrics: any = concurrences.map((concurrence) => ({
      hour: concurrence.hourIntervalStart,
      total: (concurrence.entries - concurrence.exits) * profitPerPerson,
      label: toCompactMoney((concurrence.entries - concurrence.exits) * profitPerPerson),
    }));

    if (metrics.length === 1) {
      metrics.unshift({
        hour: metrics[0].hour - 1,
        total: 0,
        label: "0k",
      });
    }

    const total = toMoney(metrics.reduce((acc, metric) => acc + metric.total, 0));
    if (compareVs) {
      console.log("compareVs: ", compareVs);
      const concurrences = await this.concurrenceService.getByBranch(BranchId, compareVs);
      const sortedConcurrences = this.sortConcurrencesByHour(concurrences, opening, closing);

      for (const metric of sortedConcurrences) {
        metrics.find((m) => m.hour === metric.hourIntervalStart).comparison =
          (metric.entries - metric.exits) * profitPerPerson;
      }
    }

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

  private getDateToQuery(branch: Branch, queryDate: string) {
    const today = DateTime.now().toFormat("yyyy-MM-dd");
    const formatQueryDate = DateTime.fromJSDate(new Date(queryDate)).toFormat("yyyy-MM-dd");

    const date = Boolean(queryDate.trim() || formatQueryDate === today)
      ? formatQueryDate
      : getDateToQuery(branch).date;

    return date;
  }
}
