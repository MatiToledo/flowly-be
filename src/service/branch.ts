import { Transaction } from "sequelize";
import { BranchService } from "../interface/branch";
import { Branch } from "../model";
import { BranchRepositoryImpl } from "../repository/branch";
import { UUID } from "crypto";
import { UserBranchServiceImpl } from "./userBranch";

export class BranchServiceImpl implements BranchService {
  private repository = new BranchRepositoryImpl();
  private userBranchService = new UserBranchServiceImpl();

  async findById(id: UUID, transaction?: Transaction): Promise<Branch> {
    return await this.repository.findById(id);
  }

  async update(id: UUID, data: Partial<Branch>, transaction?: Transaction): Promise<Branch> {
    const { affectedCount, affectedRows } = await this.repository.update(id, data, transaction);
    return affectedRows[0];
  }

  async create(data: Partial<Branch>, UserId: UUID, transaction?: Transaction): Promise<Branch> {
    const branch = await this.repository.create(data, transaction);
    await this.userBranchService.create({ UserId, BranchId: branch.id }, transaction);
    return branch;
  }
}
