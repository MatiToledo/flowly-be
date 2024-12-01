import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { ConcurrenceRepository } from "../interface/concurrence";
import { Concurrence } from "../model";
export class ConcurrenceRepositoryImpl implements ConcurrenceRepository {
  async getTotalByBranchId(BranchId: UUID, date: string): Promise<number> {
    try {
      const totalEntries =
        (await Concurrence.sum("entries", {
          where: { BranchId, date },
        })) || 0;

      const totalExits =
        (await Concurrence.sum("exits", {
          where: { BranchId, date },
        })) || 0;

      return totalEntries - totalExits;
    } catch (error) {
      console.error(error);
      throw new Error(`CONCURRENCE_TOTAL_NOT_CALCULATED`);
    }
  }
  async getActualByBranch(BranchId: UUID, date: string): Promise<Concurrence[]> {
    try {
      return await Concurrence.findAll({
        where: { BranchId, date },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`CONCURRENCES_NOT_FOUND`);
    }
  }
  async getByBranch(BranchId: UUID, date: string): Promise<Concurrence[]> {
    try {
      return await Concurrence.findAll({
        where: { BranchId, date },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`CONCURRENCES_NOT_FOUND`);
    }
  }
  async getActualByBranchAndUser(
    BranchId: UUID,
    UserId: UUID,
    date: string,
  ): Promise<Concurrence[]> {
    try {
      return await Concurrence.findAll({
        where: { BranchId, UserId, date },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`CONCURRENCES_NOT_FOUND`);
    }
  }

  async findOrCreate(conditions: Partial<Concurrence>): Promise<Concurrence> {
    try {
      const [stat] = await Concurrence.findOrCreate({
        where: conditions,
        defaults: { entries: 0, exits: 0 },
      });
      return stat;
    } catch (error) {
      console.error(error);
      throw new Error(`CONCURRENCE_NOT_UPDATED`);
    }
  }
}
