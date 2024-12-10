import { UUID } from "crypto";
import { ConcurrenceActualResponse, ConcurrenceService } from "../interface/concurrence";
import { Concurrence } from "../model";
import { ConcurrenceRepositoryImpl } from "../repository/concurrence";
import { getDateToQuery } from "../utils/luxon";
import { BranchServiceImpl } from "./branch";
export class ConcurrenceServiceImpl implements ConcurrenceService {
  private repository = new ConcurrenceRepositoryImpl();
  private branchService = new BranchServiceImpl();

  async getByBranch(BranchId: UUID, date: string): Promise<Concurrence[]> {
    return await this.repository.getByBranch(BranchId, date);
  }
  async getActualByBranch(BranchId: UUID): Promise<ConcurrenceActualResponse> {
    console.log("BranchId: ", BranchId);
    const branch = await this.branchService.findById(BranchId);
    console.log("branch: ", branch);

    const { date } = getDateToQuery(branch);

    const concurrences = await this.repository.getActualByBranch(BranchId, date);

    return await this.moldedActual(concurrences, BranchId, date);
  }

  async getActualByBranchAndUser(BranchId: UUID, UserId: UUID): Promise<ConcurrenceActualResponse> {
    const branch = await this.branchService.findById(BranchId);

    const { date } = getDateToQuery(branch);

    const concurrences = await this.repository.getActualByBranchAndUser(BranchId, UserId, date);
    return await this.moldedActual(concurrences, BranchId, date);
  }

  async update(data: Partial<Concurrence>): Promise<any> {
    const { BranchId, type, entranceType, UserId } = data;
    const branch = await this.branchService.findById(BranchId);

    const isBranchOpen = this.branchService.checkIfIsOpen(branch);

    if (!isBranchOpen) {
      throw new Error("La sucursal está cerrada");
    }

    const { date, hourIntervalStart } = getDateToQuery(branch);

    const concurrence = await this.repository.findOrCreate({
      BranchId,
      date,
      hourIntervalStart,
      UserId,
    });

    if (type === "entry") {
      concurrence.entries += 1;
    } else if (type === "exit") {
      concurrence.exits += 1;
    }

    if (entranceType) {
      concurrence[entranceType] += 1;
    } else {
      concurrence["paid"] += 1;
    }

    await concurrence.save();

    const [userConcurrences, branchConcurrences] = await Promise.all([
      this.repository.getActualByBranchAndUser(BranchId, UserId, date),
      this.repository.getActualByBranch(BranchId, date),
    ]);

    const totalUser = this.calculateTotals(userConcurrences);
    const totalBranch = this.calculateTotals(branchConcurrences);
    console.log("totalBranch: ", totalBranch);
    return {
      user: {
        ...totalUser,
        UserId,
        totalBranch: totalBranch.total,
      },
      partner: {
        ...totalBranch,
        totalBranch: totalBranch.total,
      },
    };
  }

  private calculateTotals(concurrences: Concurrence[]): {
    entries: number;
    exits: number;
    total: number;
  } {
    return concurrences.reduce(
      (acc, { entries, exits }) => {
        acc.entries += entries;
        acc.exits += exits;
        acc.total += entries - exits;
        return acc;
      },
      { entries: 0, exits: 0, total: 0 },
    );
  }

  private async moldedActual(
    concurrences: Concurrence[],
    BranchId: UUID,
    date: string,
  ): Promise<ConcurrenceActualResponse> {
    const totalBranch = await this.repository.getTotalByBranchId(BranchId, date);
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
        totalBranch,
      },
    );
  }
}
