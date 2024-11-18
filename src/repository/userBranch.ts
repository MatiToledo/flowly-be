import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { UserBranchRepository } from "../interface/userBranch";
import { Branch, UserBranch } from "../model";
export class UserBranchRepositoryImpl implements UserBranchRepository {
  async create(data: Partial<UserBranch>, transaction?: Transaction): Promise<UserBranch> {
    try {
      return await UserBranch.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<UserBranch>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: UserBranch[] }> {
    try {
      const [affectedCount, affectedRows] = await UserBranch.update(data, {
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

  async findById(id: UUID, transaction?: Transaction): Promise<UserBranch> {
    try {
      return await UserBranch.findByPk(id, { include: [Branch], transaction });
    } catch (error) {
      console.error(error);
      throw new Error("NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await UserBranch.destroy({
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
}
