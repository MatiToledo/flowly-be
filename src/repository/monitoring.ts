import { Transaction } from "sequelize";
import { MonitoringRepository } from "../interface/monitoring";
import Monitoring from "../model/monitoring";
import { UUID } from "crypto";
export class MonitoringRepositoryImpl implements MonitoringRepository {
  async create(data: Partial<Monitoring>, transaction?: Transaction): Promise<Monitoring> {
    try {
      return await Monitoring.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error.message);
      if (error.message === "Validation error") {
        throw new Error(`MONITORING_ALREADY_EXISTS`);
      }
      throw new Error(`MONITORING_NOT_CREATED`);
    }
  }
  async checkIfAlreadyExistsByBranch(data: Partial<Monitoring>): Promise<boolean> {
    try {
      const exists = await Monitoring.findOne({
        where: data,
      });
      return Boolean(exists);
    } catch (error) {
      throw new Error(`MONITORING_NOT_FOUND`);
    }
  }
  async getByBranch(BranchId: UUID, date: string): Promise<Monitoring[]> {
    try {
      return await Monitoring.findAll({
        where: { BranchId, date },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`MONITORINGS_NOT_FOUND`);
    }
  }
  async findLatest(BranchId: UUID): Promise<Monitoring> {
    try {
      return await Monitoring.findOne({
        where: { BranchId },
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error(error);
      throw new Error(`MONITORINGS_NOT_FOUND`);
    }
  }
}
