import { Transaction } from "sequelize";
import { Alert } from "../model";
import { UUID } from "crypto";
export interface AlertService {
  create(data: Partial<Alert>, UserId: UUID): Promise<Alert>;
  findByBranch(BranchId: UUID, transaction?: Transaction): Promise<Alert[]>;
}

export interface AlertRepository {
  create(data: Partial<Alert>, transaction?: Transaction): Promise<Alert>;
  findByBranch(BranchId: UUID, transaction?: Transaction): Promise<Alert[]>;
}
