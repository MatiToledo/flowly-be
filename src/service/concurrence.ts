import { DateTime } from "luxon";
import { ConcurrenceService } from "../interface/concurrence";
import { Concurrence } from "../model";
import { ConcurrenceRepositoryImpl } from "../repository/concurrence";
import { BranchServiceImpl } from "./branch";
import { UUID } from "crypto";
export class ConcurrenceServiceImpl implements ConcurrenceService {
  private repository = new ConcurrenceRepositoryImpl();
  private branchService = new BranchServiceImpl();

  async getActualByBranchId(BranchId: UUID) {
    const branch = await this.branchService.findById(BranchId);
    const branchTimeZone = branch.timeZone;
    const nowUtc = DateTime.utc();
    const localTime = nowUtc.setZone(branchTimeZone);
    const date = localTime.toISODate();

    const concurrences = await this.repository.getActualByBranchId(BranchId, date);
    return concurrences.reduce(
      (acc, concurrence) => {
        acc.total += concurrence.entries - concurrence.exits;
        acc.entries += concurrence.entries;
        acc.exits += concurrence.exits;
        return acc;
      },
      {
        total: 0,
        entries: 0,
        exits: 0,
      },
    );
  }
  async update(data: Partial<Concurrence>) {
    const { BranchId, type, entranceType } = data;
    const branch = await this.branchService.findById(BranchId);
    const branchTimeZone = branch.timeZone;

    const nowUtc = DateTime.utc();

    const localTime = nowUtc.setZone(branchTimeZone);

    const hourIntervalStart = localTime.hour;
    const date = localTime.toISODate();

    const concurrence = await this.repository.findOrCreate({ BranchId, date, hourIntervalStart });

    if (type === "entry") {
      concurrence.entries += 1;
    } else if (type === "exit") {
      concurrence.exits += 1;
    }

    if (entranceType) {
      concurrence[entranceType] += 1;
    }

    await concurrence.save();
  }
}
