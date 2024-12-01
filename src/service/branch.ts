import { Transaction } from "sequelize";
import { BranchService } from "../interface/branch";
import { Branch } from "../model";
import { BranchRepositoryImpl } from "../repository/branch";
import { UUID } from "crypto";
import { UserBranchServiceImpl } from "./userBranch";
import { DateTime } from "luxon";
import { getLocalNow, getOpeningAndClosingTime } from "../utils/luxon";

export class BranchServiceImpl implements BranchService {
  private repository = new BranchRepositoryImpl();
  private userBranchService = new UserBranchServiceImpl();

  async findById(id: UUID, transaction?: Transaction): Promise<Branch> {
    return await this.repository.findById(id, transaction);
  }

  async update(id: UUID, data: Partial<Branch>): Promise<Branch> {
    data.closing = DateTime.fromISO(data.closing).toFormat("HH:mm");
    data.opening = DateTime.fromISO(data.opening).toFormat("HH:mm");
    const { affectedRows } = await this.repository.update(id, data);
    return affectedRows[0];
  }

  async create(data: Partial<Branch>, UserId: UUID, transaction?: Transaction): Promise<Branch> {
    data.closing = DateTime.fromISO(data.closing).toFormat("HH:mm");
    data.opening = DateTime.fromISO(data.opening).toFormat("HH:mm");
    const branch = await this.repository.create(data, transaction);
    await this.userBranchService.create({ UserId, BranchId: branch.id }, transaction);
    return branch;
  }

  checkIfIsOpen(branch: Branch): boolean {
    const now = getLocalNow(branch.timeZone);
    const { openingTime, closingTime } = getOpeningAndClosingTime(branch);

    const branchHoursPassMidnight = closingTime < openingTime;
    const isAfterOpening = now >= openingTime;
    const isBeforeClosing = now <= closingTime;

    let isOpen;

    if (branchHoursPassMidnight) {
      // Caso: rango cruza la medianoche
      isOpen = isAfterOpening || isBeforeClosing;
    } else {
      // Caso: rango dentro del mismo día
      isOpen = isAfterOpening && isBeforeClosing;
    }

    return isOpen;
  }
}
