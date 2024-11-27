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
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Alert>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Alert[] }> {
    try {
      const [affectedCount, affectedRows] = await Alert.update(data, {
        where: { id },
        transaction,
        returning: true,
      });
      return { affectedCount, affectedRows };
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_UPDATED`);
    }
  }

  async findById(id: UUID, transaction?: Transaction): Promise<Alert> {
    try {
      return await Alert.findByPk(id, { transaction });
    } catch (error) {
      console.error(error);
      throw new Error("NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await Alert.destroy({
        where: { id },
        transaction,
      });
      if (res > 0) {
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      throw new Error("NOT_DELETED");
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
      throw new Error("NOT_FOUND");
    }
  }
}
