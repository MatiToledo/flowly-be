import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { AlertService } from "../interface/alert";
import { Alert } from "../model";
import { AlertRepositoryImpl } from "../repository/alert";

export class AlertServiceImpl implements AlertService {
  private repository = new AlertRepositoryImpl();
  async findByBranch(BranchId: UUID, transaction?: Transaction): Promise<Alert[]> {
    return await this.repository.findByBranch(BranchId, transaction);
  }

  async create(data: Partial<Alert>, UserId: UUID): Promise<Alert> {
    const alert = await this.repository.create({ ...data, UserId });
    return alert;
  }
}
