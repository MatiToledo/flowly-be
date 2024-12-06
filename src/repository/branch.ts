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
      throw new Error(`BRANCH_NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Branch>,
  ): Promise<{ affectedCount: number; affectedRows: Branch[] }> {
    try {
      const [affectedCount, affectedRows] = await Branch.update(data, {
        where: { id },
        returning: true,
      });
      return { affectedCount, affectedRows };
    } catch (error) {
      console.error(error);
      throw new Error(`BRANCH_NOT_UPDATED`);
    }
  }

  async findById(id: UUID, transaction?: Transaction): Promise<Branch> {
    try {
      return await Branch.findByPk(id, { transaction });
    } catch (error) {
      console.error(error);
      throw new Error("BRANCH_NOT_FOUND");
    }
  }
}
