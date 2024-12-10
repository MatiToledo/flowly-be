import { UUID } from "crypto";
import { DateTime } from "luxon";
import { MetricsService } from "../interface/metrics";
import { Branch, Concurrence } from "../model";
import { EntranceTypeEnum } from "../model/concurrence";
import { getDateToQuery } from "../utils/luxon";
import toMoney, { toCompactMoney } from "../utils/toMoney";
import { BranchServiceImpl } from "./branch";
import { ConcurrenceServiceImpl } from "./concurrence";
import { MonitoringServiceImpl } from "./monitoring";
import Monitoring from "../model/monitoring";

export class MetricsServiceImpl implements MetricsService {
  private concurrenceService = new ConcurrenceServiceImpl();
  private monitoringService = new MonitoringServiceImpl();
  private branchService = new BranchServiceImpl();

  async getByBranch(BranchId: UUID, queries: any): Promise<any> {
    const branch = await this.branchService.findById(BranchId);
    const { opening, closing } = branch;

    let date = this.getDateToQuery(branch, queries.date);
    const isBranchOpen = this.branchService.checkIfIsOpen(branch);
    if (!isBranchOpen && queries.date !== date) {
      date = DateTime.fromISO(date).minus({ days: 1 }).toISODate();
    }
    const concurrences = await this.concurrenceService.getByBranch(BranchId, date);
    console.log("concurrences as: ", concurrences.length);
    const monitorings = await this.monitoringService.getByBranch(BranchId, date);
    const sortedConcurrencesByHour = this.sorMetricsByHour(concurrences, opening, closing);
    console.log("sortedConcurrencesByHour: ", sortedConcurrencesByHour.length);
    const sortedMonitoringsByHour = this.sorMetricsByHour(monitorings, opening, closing);
    const metrics = await this.createMetrics(
      sortedConcurrencesByHour,
      sortedMonitoringsByHour,
      queries,
      branch,
    );

    return metrics;
  }

  private async createMetrics(
    concurrences: Concurrence[],
    monitorings: Monitoring[],
    queries: any,
    branch: Branch,
  ) {
    let metrics = {
      entries: {},
      earnings: {},
      typeEntries: {},
      peopleInBars: {},
      peopleInDance: {},
    };
    const molders = {
      entries: async () => await this.getEntriesPerHour(concurrences, queries.entriesVs, branch),
      earnings: async () => await this.getEarningsPerHour(concurrences, queries.earningVs, branch),
      typeEntries: async () =>
        await this.getTypeEntries(concurrences, queries.typeEntriesVs, branch),
      peopleInBars: async () =>
        await this.getPeoplePerHour(monitorings, queries.peopleInBarsVs, branch, "peopleInBars"),
      peopleInDance: async () =>
        await this.getPeoplePerHour(monitorings, queries.peopleInDanceVs, branch, "peopleInDance"),
    };

    for (const metric of Object.keys(metrics)) {
      metrics[metric] = await molders[metric]();
    }

    return metrics;
  }

  private async getTypeEntries(concurrences: Concurrence[], compareVs: string, branch: Branch) {
    const { id: BranchId, opening, closing } = branch;

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
      compareVs
        ? [
            { type: "paid", total: 0, comparison: 0 },
            { type: "free", total: 0, comparison: 0 },
            { type: "qr", total: 0, comparison: 0 },
            { type: "vip", total: 0, comparison: 0 },
            { type: "guests", total: 0, comparison: 0 },
          ]
        : [
            { type: "paid", total: 0 },
            { type: "free", total: 0 },
            { type: "qr", total: 0 },
            { type: "vip", total: 0 },
            { type: "guests", total: 0 },
          ],
    );

    if (compareVs) {
      const concurrences = await this.concurrenceService.getByBranch(BranchId, compareVs);
      const sortedConcurrences = this.sorMetricsByHour(concurrences, opening, closing);

      for (const metric of sortedConcurrences) {
        metrics.forEach((toUpdate) => {
          toUpdate.comparison += metric[toUpdate.type] || 0;
        });
      }
    }

    return { metrics };
  }
  private async getEntriesPerHour(concurrences: Concurrence[], compareVs: string, branch: Branch) {
    const { id: BranchId, opening, closing } = branch;
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
      const concurrences = await this.concurrenceService.getByBranch(BranchId, compareVs);
      const sortedConcurrences = this.sorMetricsByHour(concurrences, opening, closing);
      const missingMetrics = metrics.filter(
        (m) => !concurrences.some((c) => m.hour === c.hourIntervalStart),
      );

      for (const metric of sortedConcurrences) {
        metrics.find((m) => m.hour === metric.hourIntervalStart).comparison =
          metric.entries - metric.exits;
      }
      for (const missing of missingMetrics) {
        missing.comparison = 0;
      }
    }

    return {
      total,
      metrics,
    };
  }

  private async getEarningsPerHour(concurrences: Concurrence[], compareVs: string, branch: Branch) {
    const { id: BranchId, opening, closing, profitPerPerson } = branch;

    const metrics: any = concurrences.map((concurrence) => ({
      hour: concurrence.hourIntervalStart,
      total: concurrence.entries * profitPerPerson,
      label: toCompactMoney(concurrence.entries * profitPerPerson),
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
      const concurrences = await this.concurrenceService.getByBranch(BranchId, compareVs);
      const sortedConcurrences = this.sorMetricsByHour(concurrences, opening, closing);
      const missingMetrics = metrics.filter(
        (m) => !concurrences.some((c) => m.hour === c.hourIntervalStart),
      );

      for (const metric of sortedConcurrences) {
        metrics.find((m) => m.hour === metric.hourIntervalStart).comparison =
          metric.entries * profitPerPerson;
        metrics.find((m) => m.hour === metric.hourIntervalStart).comparisonLabel = toCompactMoney(
          metric.entries * profitPerPerson,
        );
      }
      for (const missing of missingMetrics) {
        missing.comparison = 0;
      }
    }

    return {
      total, // Formatea como moneda al final
      metrics,
    };
  }

  private async getPeoplePerHour(
    monitorings: Monitoring[],
    compareVs: string,
    branch: Branch,
    type: "peopleInBars" | "peopleInDance",
  ) {
    const { id: BranchId, opening, closing } = branch;

    const valuesReference = {
      empty: 0,
      few: 1,
      aLot: 2,
      tooMany: 3,
    };

    const metrics: any = monitorings.map((monitoring) => ({
      hour: this.convertMonitoringTimeToDate(monitoring.hourIntervalStart),
      total: valuesReference[monitoring[type]],
      label: monitoring[type],
    }));
    if (compareVs) {
      const monitorings = await this.monitoringService.getByBranch(BranchId, compareVs);
      const sortedMonitorings = this.sorMetricsByHour(monitorings, opening, closing);
      const missingMetrics = metrics.filter(
        (m) =>
          !monitorings.some(
            (c) => m.hour === this.convertMonitoringTimeToDate(c.hourIntervalStart),
          ),
      );

      for (const metric of sortedMonitorings) {
        const metricToUpdate = metrics.find(
          (m) => m.hour === this.convertMonitoringTimeToDate(metric.hourIntervalStart),
        );
        metricToUpdate.comparison = valuesReference[metric[type]];
        metricToUpdate.comparisonLabel = metric[type];
      }
      for (const missing of missingMetrics) {
        missing.comparison = 0;
      }
    }

    return { metrics };
  }

  private sorMetricsByHour(array: any[], opening: string, closing: string) {
    const openingHour = parseInt(opening.split(":")[0], 10);
    const closingHour = parseInt(closing.split(":")[0], 10);

    const beforeMidnight = array
      .filter((metric) => metric.hourIntervalStart >= openingHour && metric.hourIntervalStart < 24)
      .sort((a, b) => a.hourIntervalStart - b.hourIntervalStart);

    const afterMidnight = array
      .filter(
        (metric) =>
          metric.hourIntervalStart >= 0 &&
          metric.hourIntervalStart < closingHour &&
          metric.hourIntervalStart < openingHour,
      )
      .sort((a, b) => a.hourIntervalStart - b.hourIntervalStart);

    return beforeMidnight.concat(afterMidnight);
  }

  private getDateToQuery(branch: Branch, queryDate: string) {
    const today = DateTime.now().toFormat("yyyy-MM-dd");

    const date = queryDate && queryDate !== today ? queryDate : getDateToQuery(branch).date;

    return date;
  }

  private convertMonitoringTimeToDate(hourIntervalStart: number) {
    const hours = Math.floor(hourIntervalStart);
    const minutes = hourIntervalStart % 1 === 0.5 ? 30 : 0;
    const time = DateTime.fromObject({ hour: hours, minute: minutes });

    return time.toFormat("HH:mm");
  }
}
