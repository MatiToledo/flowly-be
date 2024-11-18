import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { BranchRepository } from "../interface/branch";
import { Branch } from "../model";
export class BranchRepositoryImpl implements BranchRepository {
  async create(data: Partial<Branch>, transaction?: Transaction): Promise<Branch> {
    try {
      return await Branch.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Branch>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Branch[] }> {
    try {
      const [affectedCount, affectedRows] = await Branch.update(data, {
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

  async findById(id: UUID, transaction?: Transaction): Promise<Branch> {
    try {
      return await Branch.findByPk(id, { transaction });
    } catch (error) {
      console.error(error);
      throw new Error("NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await Branch.destroy({
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
