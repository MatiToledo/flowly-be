import { Transaction } from "sequelize";
import { UserBranchService } from "../interface/userBranch";
import { UserBranch } from "../model";
import { UserBranchRepositoryImpl } from "../repository/userBranch";
import { UUID } from "crypto";
export class UserBranchServiceImpl implements UserBranchService {
  private repository = new UserBranchRepositoryImpl();

  async create(data: Partial<UserBranch>, transaction: Transaction) {
    return await this.repository.create(data, transaction);
  }
  async findAllByBranchId(BranchId: UUID, transaction: Transaction) {
    return await this.repository.findAllByBranchId(BranchId, transaction);
  }

  async findAllByUserId(UserId: UUID, transaction: Transaction) {
    return await this.repository.findAllByUserId(UserId, transaction);
  }
}
