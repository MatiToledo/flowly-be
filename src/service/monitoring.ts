import { MonitoringService } from "../interface/monitoring";
import Monitoring from "../model/monitoring";
import { MonitoringRepositoryImpl } from "../repository/monitoring";
import { getDateToQuery, getDateToQueryMonitoring, getLocalNow } from "../utils/luxon";
import { BranchServiceImpl } from "./branch";
import { UUID } from "crypto";
export class MonitoringServiceImpl implements MonitoringService {
  private repository = new MonitoringRepositoryImpl();
  private branchService = new BranchServiceImpl();

  async checkIfAlreadyExistsByBranch(
    BranchId: UUID,
  ): Promise<{ alreadyExists: boolean; nextUpdateOn: string }> {
    const branch = await this.branchService.findById(BranchId);
    const { date, hourIntervalStart } = getDateToQueryMonitoring(branch);
    const alreadyExists = await this.repository.checkIfAlreadyExistsByBranch({
      date,
      hourIntervalStart,
      BranchId,
    });
    const nextUpdateOn = this.getNextTimeToUpdate(branch.timeZone);
    return {
      alreadyExists,
      nextUpdateOn,
    };
  }

  async create(data: Partial<Monitoring>): Promise<any> {
    const branch = await this.branchService.findById(data.BranchId);

    // const isBranchOpen = this.branchService.checkIfIsOpen(branch);

    // if (!isBranchOpen) {
    //   throw new Error("La sucursal está cerrada");
    // }
    const { date, hourIntervalStart } = getDateToQueryMonitoring(branch);

    return await this.repository.create({
      ...data,
      date,
      hourIntervalStart,
    });
  }

  async getByBranch(BranchId: UUID, date: string): Promise<Monitoring[]> {
    return await this.repository.getByBranch(BranchId, date);
  }

  private getNextTimeToUpdate(timeZone: string) {
    const now = getLocalNow(timeZone);
    const minutes = now.minute;

    const nextHalfHour = minutes < 30 ? 30 : 60;

    return now.set({ minute: nextHalfHour, second: 0, millisecond: 0 }).toFormat("HH:mm");
  }
}
