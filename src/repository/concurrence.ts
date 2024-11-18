import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { ConcurrenceRepository } from "../interface/concurrence";
import { Concurrence } from "../model";
export class ConcurrenceRepositoryImpl implements ConcurrenceRepository {
  async getActualByBranchId(BranchId: UUID, date: string): Promise<Concurrence[]> {
    try {
      return await Concurrence.findAll({
        where: { BranchId, date },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_FOUND`);
    }
  }

  async findOrCreate(
    conditions: Partial<Concurrence>,
    transaction?: Transaction,
  ): Promise<Concurrence> {
    try {
      const [stat] = await Concurrence.findOrCreate({
        where: conditions,
        defaults: { entries: 0, exits: 0 },
      });
      return stat;
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async create(data: Partial<Concurrence>, transaction?: Transaction): Promise<Concurrence> {
    try {
      return await Concurrence.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Concurrence>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Concurrence[] }> {
    try {
      const [affectedCount, affectedRows] = await Concurrence.update(data, {
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

  async findById(id: UUID, transaction?: Transaction): Promise<Concurrence> {
    try {
      return await Concurrence.findByPk(id, { transaction });
    } catch (error) {
      console.error(error);
      throw new Error("NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await Concurrence.destroy({
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
