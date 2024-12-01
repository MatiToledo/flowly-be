import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { AlertRepository } from "../interface/alert";
import { Alert, User } from "../model";

export class AlertRepositoryImpl implements AlertRepository {
  async create(data: Partial<Alert>, transaction?: Transaction): Promise<Alert> {
    try {
      return await Alert.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`ALERT_NOT_CREATED`);
    }
  }

  async findByBranch(BranchId: UUID, transaction?: Transaction): Promise<Alert[]> {
    try {
      return await Alert.findAll({
        where: { BranchId },
        include: [{ model: User, attributes: ["fullName"] }],
        limit: 5,
        order: [["createdAt", "DESC"]],
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error("ALERT_BY_BRANCH_NOT_FOUND");
    }
  }
}
